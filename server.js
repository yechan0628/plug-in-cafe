const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static frontend files from current directory

// Initialize Prisma Client with PostgreSQL Driver Adapter for Prisma 7
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("Error: DATABASE_URL must be defined in your .env or .env.local file.");
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
console.log("Prisma Client with PgAdapter initialized successfully.");

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

// 2. Toggle seat occupancy status
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
        
        res.json({ success: true, updated: updatedSeat });
    } catch (err) {
        console.error("Error toggling seat:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. AI Cafe Recommendation Assistant Chatbot API (Gemini LLM)
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }
        
        // Fetch fresh real-time database state
        const cafesData = await prisma.cafe.findMany({
            include: {
                seats: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            }
        });
        
        const currentCafes = mapPrismaToFrontend(cafesData);
        
        // Prepare helper counts for cafes to make prompt easier to read
        const cafeStatsContext = currentCafes.map(cafe => {
            const plugSeats = cafe.seats.filter(s => s.type === 'seat' && s.plugged);
            const freePlugs = plugSeats.filter(s => !s.occupied).reduce((sum, s) => sum + (s.span || 1), 0);
            const totalPlugs = plugSeats.reduce((sum, s) => sum + (s.span || 1), 0);
            return `- ${cafe.name} (${cafe.distance}): 총 ${totalPlugs}석의 콘센트 좌석 중 현재 ${freePlugs}석 비어있음, 주차: ${cafe.parking ? '가능' : '불가능'}, 영업시간: ${cafe.hours}, 혼잡도: ${cafe.congestion === 'low' ? '한적함' : cafe.congestion === 'mid' ? '보통' : '혼잡함'}, 주소: ${cafe.address}`;
        }).join('\n');
        
        const systemPrompt = `
당신은 신촌역 인근 콘센트 카페 찾기 서비스인 "Plug-In Cafe(플러그인 카페)"의 친절하고 전문적인 AI 추천 비서("Plug-In AI 비서")입니다.

현재 데이터베이스에 저장된 실시간 신촌 인근 카페들의 콘센트 좌석 현황 및 정보는 다음과 같습니다:
[실시간 카페 현황]
${cafeStatsContext}

[답변 원칙]
1. 사용자의 질문에 맞춰 오직 위의 [실시간 카페 현황] 데이터에 기반하여 정직하고 친절하게 답변하세요.
2. 예시:
   - "주차되고 콘센트 있는 곳 추천해줘" -> 주차가 가능하고 콘센트 잔여석이 있는 매장 추천.
   - "가장 한적한 스타벅스가 어디야?" -> 스타벅스 매장의 혼잡도(congestion) 정보를 바탕으로 추천.
3. 답변은 불필요하게 길지 않고, 친절한 말투(존댓말)로 2~3줄 내외 혹은 깔끔한 글머리 기호(Bullet points) 형식으로 간결하게 작성하세요.
4. 만약 데이터에 기반한 확실한 추천이 불가능하거나 데이터 범위를 넘어서는 질문이라면, 데이터의 한계를 정중히 밝히고 플러그인 카페 지도상의 실시간 정보를 활용할 수 있도록 안내하세요.
`;

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey || geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            // Simulated fallback mode
            console.log("Simulating Gemini AI Response (API Key is not configured)");
            
            // Build simple rule-based simulated response based on keywords
            let reply = "";
            const query = message.toLowerCase();
            
            if (query.includes("주차")) {
                const parkingCafes = currentCafes.filter(c => c.parking);
                reply = `🚗 현재 주차가 가능한 매장은 **${parkingCafes.map(c => c.name).join(', ')}** 입니다. 특히 '${parkingCafes[0].name}' 매장은 현재 콘센트석 여유도 충분하여 편하게 이용하실 수 있습니다!`;
            } else if (query.includes("스타벅스")) {
                const starbucks = currentCafes.filter(c => c.name.includes("스타벅스"));
                reply = `💚 스타벅스 매장은 현재 신촌역 부근에 여러 지점이 있습니다. 가장 가까운 지점은 **${starbucks[0].name}**(${starbucks[0].distance})이며, 콘센트 이용은 실시간 좌석 배치도를 통해 실시간 터치로 확인해 보세요.`;
            } else if (query.includes("한적") || query.includes("조용")) {
                const quietCafes = currentCafes.filter(c => c.congestion === 'low');
                reply = `🍃 현재 매장이 한적하고 조용한 편인 카페는 **${quietCafes.map(c => c.name).join(', ')}** 입니다. 쾌적한 작업 공간이 필요하시다면 해당 매장들을 적극 추천드립니다.`;
            } else {
                // Default fallback recommendation
                const sortedByPlugs = [...currentCafes].sort((a,b) => {
                    const aFree = a.seats.filter(s => s.type === 'seat' && s.plugged && !s.occupied).length;
                    const bFree = b.seats.filter(s => s.type === 'seat' && s.plugged && !s.occupied).length;
                    return bFree - aFree;
                });
                reply = `🔌 안녕하세요! 현재 신촌역 인근에서 콘센트 여유 자리가 가장 많은 매장은 **${sortedByPlugs[0].name}** (잔여 콘센트 자리가 넉넉함) 입니다. 작업하기 좋은 최적의 환경을 원하신다면 해당 매장의 도면을 클릭해 상세 좌석을 확인해보세요!`;
            }
            
            return res.json({ reply: `[⚠️ 시뮬레이션 모드 - .env 파일에 API 키 등록 시 실제 AI 추천이 활성화됩니다]\n\n${reply}` });
        }
        
        // Call Real Gemini API using GoogleGenAI
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent([
            { text: systemPrompt },
            { text: `사용자 질문: ${message}` }
        ]);
        
        const replyText = result.response.text();
        res.json({ reply: replyText });
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
