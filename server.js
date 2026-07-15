const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static frontend files from current directory

// Middleware to catch database connection configuration errors gracefully
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && !prisma) {
        return res.status(500).json({
            error: "DATABASE_URL이 설정되지 않았거나 Prisma Client 초기화에 실패했습니다. Vercel Project Settings에서 환경 변수를 등록한 뒤 Redeploy를 실행했는지 확인해 주세요!"
        });
    }
    next();
});

// Initialize Prisma Client with PostgreSQL Driver Adapter for Prisma 7
let prisma;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("Error: DATABASE_URL must be defined in your environment variables.");
} else {
    try {
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
        console.log("Prisma Client with PgAdapter initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize Prisma Client:", err);
    }
}

// Self-healing database initializer for User and Coupon
async function getOrCreateDefaultUser() {
    if (!prisma) {
        return { id: 1, points: 1000 };
    }
    let user = await prisma.user.findUnique({
        where: { id: 1 }
    });
    if (!user) {
        user = await prisma.user.create({
            data: { id: 1, points: 1000 }
        });
        // Create a default welcome coupon
        await prisma.coupon.create({
            data: {
                code: "WELCOME2026",
                discount: "신촌 플러그인 가입 축하 아메리카노 1잔 무료 쿠폰 ☕",
                used: false
            }
        });
    }
    return user;
}

// Map database entities to camelCase frontend entities
function mapPrismaToFrontend(cafesData) {
    return cafesData.map(cafe => ({
        id: cafe.id,
        name: cafe.name,
        rating: parseFloat(cafe.rating) || 0.0,
        distance: cafe.distance,
        address: cafe.address,
        hours: cafe.hours,
        parking: cafe.parking,
        congestion: cafe.congestion,
        x: cafe.x,
        y: cafe.y,
        logoUrl: cafe.logoUrl,
        seats: cafe.seats.map(s => ({
            id: s.seatKey,
            type: s.type,
            plugged: s.plugged,
            occupied: s.occupied,
            label: s.label,
            floor: s.floor,
            shape: s.shape,
            span: s.span
        }))
    }));
}

// 1. Get all cafes with nested seats layout and statistics
app.get('/api/cafes', async (req, res) => {
    try {
        const cafesData = await prisma.cafe.findMany({
            include: {
                seats: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            }
        });
        
        const frontendCafes = mapPrismaToFrontend(cafesData);
        res.json(frontendCafes);
    } catch (err) {
        console.error("Error fetching cafes:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Toggle seat occupancy status (Reservations & Point accumulation)
app.post('/api/seats/toggle', async (req, res) => {
    try {
        const { cafeId, seatKey, floor, occupied } = req.body;
        
        const updatedSeat = await prisma.seat.update({
            where: {
                unique_cafe_seat_floor: {
                    cafeId: Number(cafeId),
                    seatKey: seatKey,
                    floor: Number(floor)
                }
            },
            data: {
                occupied: occupied
            }
        });

        let earnedPoints = 0;
        let currentPoints = 1000;
        
        // Give 100 points reward when reserving/occupying a seat
        if (occupied) {
            const user = await getOrCreateDefaultUser();
            const updatedUser = await prisma.user.update({
                where: { id: 1 },
                data: { points: user.points + 100 }
            });
            currentPoints = updatedUser.points;
            earnedPoints = 100;
        } else {
            const user = await getOrCreateDefaultUser();
            currentPoints = user.points;
        }
        
        res.json({ 
            success: true, 
            updated: updatedSeat,
            earnedPoints: earnedPoints,
            currentPoints: currentPoints
        });
    } catch (err) {
        console.error("Error toggling seat:", err);
        res.status(500).json({ error: err.message });
    }
});

// Helper to get count of active (unused and unexpired) coupons
async function getActiveCouponsCount() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return await prisma.coupon.count({
        where: {
            used: false,
            createdAt: {
                gte: sevenDaysAgo
            }
        }
    });
}

// 3. Get current User profile and coupon list with calculated expiration dates
app.get('/api/user', async (req, res) => {
    try {
        const user = await getOrCreateDefaultUser();
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        // Add YYYY-MM-DD formatted expiration date (7 days after creation) and check if expired
        const processedCoupons = coupons.map(c => {
            const expDate = new Date(new Date(c.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);
            const now = new Date();
            const expired = now > expDate && !c.used;
            return {
                id: c.id,
                code: c.code,
                discount: c.discount,
                used: c.used,
                createdAt: c.createdAt,
                expired: expired,
                expirationDate: expDate.toISOString().split('T')[0]
            };
        });
        
        res.json({
            points: user.points,
            coupons: processedCoupons
        });
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Claim coupon manually or programmatically with holding limit check
app.post('/api/user/claim-coupon', async (req, res) => {
    try {
        const { discount } = req.body;
        
        // Enforce maximum 3 active coupons limit
        const activeCount = await getActiveCouponsCount();
        if (activeCount >= 3) {
            return res.status(400).json({ 
                success: false, 
                error: "보유 가능한 미사용 쿠폰 한도(최대 3장)를 초과했습니다. 기존 쿠폰을 먼저 사용해 주세요!" 
            });
        }
        
        const code = "CPN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        const newCoupon = await prisma.coupon.create({
            data: {
                code: code,
                discount: discount || "신촌 카페 연동 1,000원 할인권 🎫",
                used: false
            }
        });
        
        res.json({ success: true, coupon: newCoupon });
    } catch (err) {
        console.error("Error claiming coupon:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. AI Cafe Recommendation Assistant Chatbot API (Gemini LLM with Rewards Integration)
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }
        
        // Fetch fresh database states
        const cafesData = await prisma.cafe.findMany({
            include: {
                seats: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            }
        });
        const user = await getOrCreateDefaultUser();
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        const currentCafes = mapPrismaToFrontend(cafesData);
        
        // Prepare helper counts for cafes to make prompt easier to read
        const cafeStatsContext = currentCafes.map(cafe => {
            const plugSeats = cafe.seats.filter(s => s.type === 'seat' && s.plugged);
            const freePlugs = plugSeats.filter(s => !s.occupied).reduce((sum, s) => sum + (s.span || 1), 0);
            const totalPlugs = plugSeats.reduce((sum, s) => sum + (s.span || 1), 0);
            return `- ${cafe.name} (${cafe.distance}): 총 ${totalPlugs}석의 콘센트 좌석 중 현재 ${freePlugs}석 비어있음, 주차: ${cafe.parking ? '가능' : '불가능'}, 영업시간: ${cafe.hours}, 혼잡도: ${cafe.congestion === 'low' ? '한적함' : cafe.congestion === 'mid' ? '보통' : '혼잡함'}, 주소: ${cafe.address}`;
        }).join('\n');

        const couponsList = coupons.map(c => `- ${c.discount} (코드: ${c.code}, 사용여부: ${c.used ? '사용함' : '미사용'})`).join('\n') || "없음";
        
        const systemPrompt = `
당신은 신촌역 인근 콘센트 카페 찾기 서비스인 "Plug-In Cafe(플러그인 카페)"의 친절하고 전문적인 AI 추천 비서("Plug-In AI 비서")입니다.

현재 데이터베이스에 저장된 실시간 신촌 인근 카페들의 콘센트 좌석 현황 및 정보는 다음과 같습니다:
[실시간 카페 현황]
${cafeStatsContext}

현재 로그인한 사용자 정보 (마이페이지 연동):
- 보유 포인트: ${user.points} P (좌석을 터치하여 이용/예약할 때마다 +100 P 적립!)
- 보유 쿠폰 목록:
${couponsList}

[답변 원칙]
1. 사용자의 질문에 맞춰 오직 위의 [실시간 카페 현황] 및 [사용자 정보] 데이터에 기반하여 정직하고 친절하게 답변하세요.
2. 사용자가 카페 추천 외에 자신의 포인트나 쿠폰, 예약(좌석 클릭/점유)에 관해 질문하면 친절하게 대답해 주십시오. (예: 좌석 배치도에서 원하는 좌석을 클릭하여 예약을 변경할 때마다 100포인트가 적립됩니다!)
3. 사용자가 쿠폰을 새로 발급해 달라고 요청하는 경우(예: "쿠폰 줘", "쿠폰 발급해줘"), 답변 말미에 대괄호를 사용하여 정확히 \`[ISSUE_COUPON: <쿠폰 이름>]\` 형태로 기재하세요. 쿠폰 이름은 실속 있는 카페 혜택으로 자유롭게 지어주십시오.
   예: "요청하신 쿠폰을 발급해 드렸습니다! [ISSUE_COUPON: 신촌 카페 연동 아메리카노 무료 쿠폰 ☕]"
4. 답변은 불필요하게 길지 않고, 친절한 말투(존댓말)로 2~3줄 내외 혹은 깔끔한 글머리 기호(Bullet points) 형식으로 간결하게 작성하세요.
5. 대화의 맥락(Context)을 기억하고 있으므로 사용자가 이전 질문에 빗대어 대화를 이어가면 (예: "거기는 영업시간이 어떻게 돼?", "주차가 무료야?") 이전 대화 상의 지점을 기준으로 유연하게 답변하세요.
`;

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;
        let replyText = "";
        let couponIssued = false;
        let newCouponData = null;
        let currentPoints = user.points;

        const hasGroqKey = groqApiKey && groqApiKey !== 'YOUR_GROQ_API_KEY_HERE';
        const hasGeminiKey = geminiApiKey && geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE';

        if (hasGroqKey) {
            // Call Groq API using groq-sdk with multi-turn chat support
            console.log("Calling Groq API...");
            const groq = new Groq({ apiKey: groqApiKey });
            
            // Format history for Groq's OpenAI-compatible format: [{ role: 'system'|'user'|'assistant', content: '...' }]
            const messages = [
                { role: 'system', content: systemPrompt }
            ];
            
            const historyToMap = (history && history.length > 0) ? history : [{ role: 'user', parts: [{ text: message }] }];
            historyToMap.forEach(h => {
                // Filter out default welcome message to keep token count minimal
                if (h.role === 'model' && h.parts[0].text.includes("플러그인 카페 AI 비서입니다")) {
                    return;
                }
                messages.push({
                    role: h.role === 'model' ? 'assistant' : 'user',
                    content: h.parts[0].text
                });
            });

            const chatCompletion = await groq.chat.completions.create({
                messages: messages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024
            });
            replyText = chatCompletion.choices[0].message.content;
        } else if (hasGeminiKey) {
            // Call Real Gemini API using GoogleGenAI with multi-turn chat support
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
            
            // Format history for Gemini API: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
            // Exclude the last user message which is passed to sendMessage()
            const historyData = (history || []).slice(0, -1).map(h => ({
                role: h.role,
                parts: [{ text: h.parts[0].text }]
            }));

            const chat = model.startChat({
                history: historyData,
                systemInstruction: systemPrompt
            });
            
            const result = await chat.sendMessage(message);
            replyText = result.response.text();
        } else {
            // Simulated fallback mode
            console.log("Simulating AI Response (Neither Groq nor Gemini Key is configured)");
            const query = message.toLowerCase();
            
            if (query.includes("쿠폰") && (query.includes("줘") || query.includes("발급") || query.includes("추가"))) {
                replyText = `요청하신 쿠폰을 발급해 드렸습니다! 마이페이지 영역에서 즉시 사용 가능합니다. [ISSUE_COUPON: 챗봇 발급 전용 라떼 1,000원 할인권 🎫]`;
            } else if (query.includes("포인트") || query.includes("예약") || query.includes("적립")) {
                replyText = `🪙 현재 고객님의 포인트는 **${user.points} P** 이며, 예약 쿠폰 혜택이 적용 중입니다. 좌석 배치도의 좌석을 터치(예약)할 때마다 100포인트가 즉시 적립됩니다!`;
            } else if (query.includes("주차")) {
                const parkingCafes = currentCafes.filter(c => c.parking);
                replyText = `🚗 현재 주차가 가능한 매장은 **${parkingCafes.map(c => c.name).join(', ')}** 입니다. 특히 '${parkingCafes[0].name}' 매장은 현재 콘센트석 여유도 충분하여 편하게 이용하실 수 있습니다!`;
            } else if (query.includes("한적") || query.includes("조용")) {
                const quietCafes = currentCafes.filter(c => c.congestion === 'low');
                replyText = `🍃 현재 매장이 한적하고 조용한 편인 카페는 **${quietCafes.map(c => c.name).join(', ')}** 입니다. 쾌적한 작업 공간이 필요하시다면 해당 매장을 추천드립니다.`;
            } else if (query.includes("시간") || query.includes("영업") || query.includes("언제") || query.includes("몇 시")) {
                const matchedCafe = currentCafes.find(c => {
                    const cleanName = c.name.replace(/\s+/g, "").toLowerCase();
                    const cleanQuery = query.replace(/\s+/g, "").toLowerCase();
                    return cleanQuery.includes(cleanName) || cleanName.split("커피").some(w => w.length > 1 && cleanQuery.includes(w)) || cleanName.split("점").some(w => w.length > 1 && cleanQuery.includes(w));
                });
                if (matchedCafe) {
                    replyText = `⏰ **${matchedCafe.name}**의 영업시간은 **${matchedCafe.hours}** 입니다. 편하신 시간에 방문해 보세요!`;
                } else {
                    const hoursList = currentCafes.slice(0, 4).map(c => `- **${c.name}**: ${c.hours}`).join("\n");
                    replyText = `⏰ 주요 신촌 카페 영업시간 안내입니다:\n${hoursList}\n\n궁금하신 카페 이름과 함께 질문해 주시면 정확한 시간을 안내해 드릴게요!`;
                }
            } else {
                const sortedByPlugs = [...currentCafes].sort((a,b) => {
                    const aFree = a.seats.filter(s => s.type === 'seat' && s.plugged && !s.occupied).length;
                    const bFree = b.seats.filter(s => s.type === 'seat' && s.plugged && !s.occupied).length;
                    return bFree - aFree;
                });
                replyText = `🔌 안녕하세요! 현재 신촌역 인근에서 콘센트 여유 자리가 가장 많은 매장은 **${sortedByPlugs[0].name}** 입니다. 작업하기 좋은 최적의 환경을 원하신다면 해당 매장의 도면을 클릭해 상세 좌석을 확인해보세요!`;
            }
        }

        // Post-process the AI response to handle coupon issuance
        const couponMatch = replyText.match(/\[ISSUE_COUPON:\s*(.*?)\]/);
        if (couponMatch) {
            const discountName = couponMatch[1].trim();
            // Remove the coupon tag from the reply text
            replyText = replyText.replace(couponMatch[0], "").trim();
            
            // Check active coupon count constraint
            const activeCount = await getActiveCouponsCount();
            if (activeCount >= 3) {
                replyText += "\n\n⚠️ **쿠폰 발급 제한**: 현재 미사용 쿠폰을 이미 3장 보유하고 계십니다. 보유 한도(최대 3장)를 초과하여 신규 발급이 제한되었으니 기존 쿠폰을 먼저 사용해 주세요!";
            } else {
                // Create coupon in database
                const code = "CPN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
                newCouponData = await prisma.coupon.create({
                    data: {
                        code: code,
                        discount: discountName || "챗봇 발급 혜택 쿠폰 🎫",
                        used: false
                    }
                });
                couponIssued = true;
                
                // Bonus points for chatbot interactions
                const updatedUser = await prisma.user.update({
                    where: { id: 1 },
                    data: { points: user.points + 100 }
                });
                currentPoints = updatedUser.points;
            }
        }
        
        res.json({ 
            reply: replyText,
            couponIssued: couponIssued,
            coupon: newCouponData,
            points: currentPoints
        });
    } catch (err) {
        console.error("Error in AI Chat API:", err);
        res.status(500).json({ error: "AI 추천 서비스 처리 중 오류가 발생했습니다." });
    }
});

// Close database connections on exit
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("Prisma disconnected. Server shut down.");
    process.exit(0);
});

// Start Server
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  🔌 Plug-In Cafe Server is running on port ${PORT}`);
    console.log(`  Local Address: http://localhost:${PORT}`);
    console.log(`===============================================`);
});
