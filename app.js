// Mock Data for Cafe Plug Finder
let cafes = [];


let selectedCafe = null;
let zoom = 1.0;
let viewX = 0;
let viewY = 0;
const viewWidth = 1000;
const viewHeight = 700;

let currentFilters = {
    searchQuery: "",
    manyPlugs: false,
    quietOnly: false,
    openNow: false,
    parking: false
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const filterManyPlugs = document.getElementById("filter-many-plugs");
const filterQuiet = document.getElementById("filter-quiet");
const filterParking = document.getElementById("filter-parking");
const cafeListContainer = document.getElementById("cafe-list");
const bottomSheet = document.getElementById("bottom-sheet");
const mapSvg = document.getElementById("map-svg");

// Initialize application
async function init() {
    await loadCafes();
    await loadUserRewards();
    createSvgPatterns();
    setupEventListeners();
    
    // Check if there is a deep link for a specific cafe
    const urlParams = new URLSearchParams(window.location.search);
    const cafeIdParam = urlParams.get('cafe');
    if (cafeIdParam) {
        const targetId = parseInt(cafeIdParam, 10);
        const targetCafe = cafes.find(c => c.id === targetId);
        if (targetCafe) {
            selectCafe(targetCafe);
            // Center map on the cafe pin
            viewX = targetCafe.x - (viewWidth * zoom) / 2;
            viewY = targetCafe.y - (viewHeight * zoom) / 2;
            mapSvg.setAttribute("viewBox", `${viewX} ${viewY} ${viewWidth * zoom} ${viewHeight * zoom}`);
        }
    }
}

// Load points and coupons from backend
async function loadUserRewards() {
    try {
        const res = await fetch('/api/user');
        const data = await res.json();
        
        // Update points
        const pointsEl = document.getElementById("user-points");
        if (pointsEl) {
            const oldText = pointsEl.innerText;
            const newText = `${data.points.toLocaleString()} P`;
            pointsEl.innerText = newText;
            
            // Add pulse effect if points actually increased
            if (oldText && oldText !== newText) {
                pointsEl.classList.add("points-updated");
                setTimeout(() => pointsEl.classList.remove("points-updated"), 600);
            }
        }
        
        // Update coupons count
        const couponsCountEl = document.getElementById("user-coupons-count");
        if (couponsCountEl) {
            couponsCountEl.innerText = `${data.coupons.length}장`;
        }
        
        // Render coupons list
        const listEl = document.getElementById("coupons-list");
        if (listEl) {
            if (data.coupons.length === 0) {
                listEl.innerHTML = `<div style="font-size: 10px; color: var(--color-secondary); text-align: center; padding: 10px 0;">보유 중인 쿠폰이 없습니다. 🎟️</div>`;
            } else {
                listEl.innerHTML = data.coupons.map(coupon => {
                    let statusText = "사용가능";
                    let statusClass = "available";
                    if (coupon.used) {
                        statusText = "사용완료";
                        statusClass = "used";
                    } else if (coupon.expired) {
                        statusText = "기간만료";
                        statusClass = "expired";
                    }
                    
                    return `
                        <div class="coupon-card" style="${coupon.expired || coupon.used ? 'opacity: 0.68;' : ''}">
                            <div class="coupon-details">
                                <span class="coupon-name">${coupon.discount}</span>
                                <span class="coupon-code" style="margin-top: 3px;">만료일: ${coupon.expirationDate}</span>
                                <span class="coupon-code" style="font-size: 8px; opacity: 0.7;">코드: ${coupon.code}</span>
                            </div>
                            <span class="coupon-status ${statusClass}">
                                ${statusText}
                            </span>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (err) {
        console.error("Failed to load user rewards:", err);
    }
}

// Toggle Coupons Dropdown
function toggleCouponsDropdown() {
    const dropdown = document.getElementById("coupons-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("open");
    }
}

// Fetch cafes from backend Express / Supabase server
async function loadCafes() {
    try {
        const res = await fetch('/api/cafes');
        cafes = await res.json();
        renderCafeList();
        renderMap();
        
        // If a cafe was selected, update its bottom sheet as well
        if (selectedCafe) {
            const freshSelected = cafes.find(c => c.id === selectedCafe.id);
            if (freshSelected) {
                selectedCafe = freshSelected;
                renderBottomSheet(selectedCafe);
            }
        }
    } catch (err) {
        console.error("Failed to load cafes from backend:", err);
    }
}

// Automatically augment cafe database on startup with floor and seat shape metadata
function augmentCafeDatabase() {
    cafes.forEach(cafe => {
        cafe.seats.forEach((item, index) => {
            // 1. Assign floor default if not defined in database
            item.floor = item.floor || 1;
            
            // 2. Format labels with floor prefixes if not already present
            if (item.label) {
                let prefix = "";
                if (item.floor === 2 && !item.label.includes("2층")) {
                    prefix = "2층 ";
                } else if (item.floor === 1 && !item.label.includes("1층")) {
                    prefix = "1층 ";
                }
                
                item.label = prefix + item.label
                    .replace("창가", "1인석")
                    .replace("바", "1인석")
                    .replace("T1", "1인석 01")
                    .replace("T2", "1인석 02")
                    .replace("T3", "1인석 03")
                    .replace("T4", "1인석 04")
                    .replace("센터", "1인석")
                    .replace("작업대", "2인석")
                    .replace("A-", "1인석 ")
                    .replace("B-", "1인석 ")
                    .replace("C-", "2인석 ");
            }
            
            // 3. Assign shapes/types dynamically based on labels
            if (item.type === "seat") {
                item.shape = "square"; // default
                
                if (item.label) {
                    const lbl = item.label.toLowerCase();
                    if (lbl.includes("소파") || lbl.includes("라운지") || lbl.includes("소파 01") || lbl.includes("소파 02") || lbl.includes("소파 03") || lbl.includes("소파 04")) {
                        item.shape = "sofa";
                    } else if (lbl.includes("스터디") || lbl.includes("communal")) {
                        item.shape = "communal";
                    } else if (lbl.includes("테이블") || lbl.includes("1인석") || lbl.includes("2인석") || lbl.includes("테라스")) {
                        item.shape = "round";
                    }
                }
            }
            
            // 4. Assign dynamic Column Spanning based on size descriptions
            if (item.type === "seat") {
                item.span = 1; // default (1-person seat)
                if (item.label) {
                    const lbl = item.label.toLowerCase();
                    if (lbl.includes("2인석") || lbl.includes("소파") || lbl.includes("라운지") || lbl.includes("테라스") || lbl.includes("작업대")) {
                        item.span = 2; // 2-person wide proportion
                    } else if (lbl.includes("스터디") || lbl.includes("communal")) {
                        item.span = 3; // 3-person / communal desk proportion
                    }
                }
            } else if (item.type === "counter") {
                item.span = item.span || 3;
            } else {
                item.span = 1;
            }
        });
        
        // 5. Inject physical table elements into the layout grid for realistic floor plan visualization
        const augmentedSeats = [];
        let seatCount = 0;
        cafe.seats.forEach((item, index) => {
            augmentedSeats.push(item);
            
            if (item.type === "seat") {
                seatCount++;
                if (seatCount % 3 === 0) {
                    // Match the table size to surrounding seats: if communal, table spans 2 or 3
                    const tableSpan = (item.span === 3) ? 2 : 1;
                    augmentedSeats.push({
                        id: `T-Gen-${cafe.id}-${index}`,
                        type: "table",
                        floor: item.floor,
                        span: tableSpan
                    });
                }
            }
        });
        cafe.seats = augmentedSeats;
    });
}

// Create SVG patterns dynamically for cafe logos
function createSvgPatterns() {
    const defs = mapSvg.querySelector("defs");
    if (!defs) return;
    
    cafes.forEach(cafe => {
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", `logo-pattern-${cafe.id}`);
        pattern.setAttribute("patternContentUnits", "objectBoundingBox");
        pattern.setAttribute("width", "1");
        pattern.setAttribute("height", "1");
        
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", cafe.logoUrl);
        img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", cafe.logoUrl);
        img.setAttribute("x", "0");
        img.setAttribute("y", "0");
        img.setAttribute("width", "1");
        img.setAttribute("height", "1");
        img.setAttribute("preserveAspectRatio", "xMidYMid slice");
        
        pattern.appendChild(img);
        defs.appendChild(pattern);
    });
}

// Compute seat statistics
function getCafeStats(cafe) {
    const plugSeats = cafe.seats.filter(s => s.type === "seat" && s.plugged);
    const freePlugSeats = plugSeats.filter(s => !s.occupied);
    
    // Sum element spans to calculate actual physical seat capacity
    const totalPlugCount = plugSeats.reduce((sum, s) => sum + (s.span || 1), 0);
    const freePlugCount = freePlugSeats.reduce((sum, s) => sum + (s.span || 1), 0);
    
    const allSeats = cafe.seats.filter(s => s.type === "seat");
    const freeSeats = allSeats.filter(s => !s.occupied);
    const totalSeats = allSeats.reduce((sum, s) => sum + (s.span || 1), 0);
    const freeSeatsCount = freeSeats.reduce((sum, s) => sum + (s.span || 1), 0);
    
    const plugRatio = totalSeats > 0 ? (totalPlugCount / totalSeats) : 0;
    const isManyPlugs = plugRatio >= 0.5 || totalPlugCount >= 6;
    
    return {
        freePlugCount,
        totalPlugCount,
        isManyPlugs,
        totalSeats,
        freeSeatsCount
    };
}

// Render dynamic SVG map
function renderMap() {
    // Clear previous markers
    const markers = mapSvg.querySelectorAll(".map-marker");
    markers.forEach(m => m.remove());

    cafes.forEach(cafe => {
        const stats = getCafeStats(cafe);
        const hasFreePlug = stats.freePlugCount > 0;
        
        // Create marker group
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
        marker.setAttribute("class", `map-marker ${hasFreePlug ? "" : "busy"} ${selectedCafe?.id === cafe.id ? "active" : ""}`);
        marker.setAttribute("id", `marker-${cafe.id}`);
        marker.setAttribute("transform", `translate(${cafe.x}, ${cafe.y})`);
        
        // Glow effect
        const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        glow.setAttribute("class", "pin-glow");
        glow.setAttribute("r", "25");
        glow.setAttribute("cx", "0");
        glow.setAttribute("cy", "-15");
        
        // Pin body (Classic coffee-cup pin or modern droplet pin)
        const pinBody = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pinBody.setAttribute("class", "pin-body");
        pinBody.setAttribute("d", "M0 -35 C-12 -35 -15 -25 -15 -15 C-15 -5 0 0 0 0 C0 0 15 -5 15 -15 C15 -25 12 -35 0 -35 Z");
        
        // White background circle to make logo background white
        const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bgCircle.setAttribute("cx", "0");
        bgCircle.setAttribute("cy", "-20");
        bgCircle.setAttribute("r", "13");
        bgCircle.setAttribute("fill", "#FFFFFF");
        
        // Logo Circle filled with Pattern
        const logoCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        logoCircle.setAttribute("cx", "0");
        logoCircle.setAttribute("cy", "-20");
        logoCircle.setAttribute("r", "13");
        logoCircle.setAttribute("fill", `url(#logo-pattern-${cafe.id})`);
        
        // Text label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = cafe.name;
        text.setAttribute("y", "18");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#3E2723");
        text.setAttribute("font-size", "11px");
        text.setAttribute("font-weight", "800");
        
        marker.appendChild(glow);
        marker.appendChild(pinBody);
        marker.appendChild(bgCircle);
        marker.appendChild(logoCircle);
        marker.appendChild(text);
        
        // Event Listener
        marker.addEventListener("click", () => selectCafe(cafe.id));
        mapSvg.appendChild(marker);
    });
}

// Render list of cafes in Sidebar
function renderCafeList() {
    cafeListContainer.innerHTML = "";
    
    const filteredCafes = cafes.filter(cafe => {
        const stats = getCafeStats(cafe);
        
        // Search Filter
        if (currentFilters.searchQuery && !cafe.name.toLowerCase().includes(currentFilters.searchQuery.toLowerCase()) && !cafe.address.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())) {
            return false;
        }
        // Many Plugs Filter
        if (currentFilters.manyPlugs && !stats.isManyPlugs) {
            return false;
        }
        // Quiet Only Filter
        if (currentFilters.quietOnly && cafe.congestion !== "low") {
            return false;
        }
        // Parking Filter
        if (currentFilters.parking && !cafe.parking) {
            return false;
        }
        return true;
    });

    if (filteredCafes.length === 0) {
        cafeListContainer.innerHTML = `
            <div style="text-align: center; color: var(--color-secondary); padding: var(--spacing-xl); font-size: 14px;">
                <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 8px;">sentiment_dissatisfied</span>
                <p>일치하는 카페가 없습니다.</p>
            </div>
        `;
        return;
    }

    filteredCafes.forEach(cafe => {
        const stats = getCafeStats(cafe);
        const card = document.createElement("div");
        card.setAttribute("class", `cafe-card ${selectedCafe?.id === cafe.id ? "active" : ""}`);
        card.setAttribute("onclick", `selectCafe(${cafe.id})`);
        
        let congestionText = "여유";
        let congestionClass = "low";
        if (cafe.congestion === "mid") {
            congestionText = "보통";
            congestionClass = "mid";
        } else if (cafe.congestion === "high") {
            congestionText = "혼잡";
            congestionClass = "high";
        }

        const hasFreePlug = stats.freePlugCount > 0;
        
        card.innerHTML = `
            <div style="display: flex; gap: var(--spacing-md); align-items: flex-start;">
                <!-- Cafe Logo -->
                <div style="flex-shrink: 0;">
                    <img src="${cafe.logoUrl}" alt="${cafe.name} 로고" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1px solid var(--color-border); display: block;" />
                </div>
                <!-- Cafe Content -->
                <div style="flex: 1; min-width: 0;">
                    <div class="cafe-card-header" style="margin-bottom: 4px;">
                        <h3 class="cafe-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; padding: 0;">${cafe.name}</h3>
                        <div class="cafe-rating">
                            <span class="material-symbols-outlined star-icon">star</span>
                            <span>${cafe.rating}</span>
                        </div>
                    </div>
                    <div class="cafe-meta" style="margin-bottom: var(--spacing-sm);">
                        <span><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">map</span>${cafe.address} (${cafe.distance})</span>
                        <span><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">schedule</span>영업시간: ${cafe.hours}</span>
                    </div>
                    <div class="cafe-badges">
                        <span class="status-badge ${hasFreePlug ? "free" : "busy"}">
                            콘센트 ${hasFreePlug ? `이용가능 (${stats.freePlugCount}/${stats.totalPlugCount})` : "만석"}
                        </span>
                        <span class="congestion-badge ${congestionClass}">혼잡도: ${congestionText}</span>
                        ${cafe.parking ? '<span class="congestion-badge" style="background-color:#EFEBE9; color:#3E2723;">주차가능</span>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        cafeListContainer.appendChild(card);
    });
}

// Select a cafe and slide up the bottom sheet
function selectCafe(id) {
    const cafe = cafes.find(c => c.id === id);
    if (!cafe) return;
    
    selectedCafe = cafe;
    
    // Highlight Active card and marker
    document.querySelectorAll(".cafe-card").forEach(c => c.classList.remove("active"));
    renderCafeList();
    
    document.querySelectorAll(".map-marker").forEach(m => m.classList.remove("active"));
    const activeMarker = document.getElementById(`marker-${cafe.id}`);
    if (activeMarker) activeMarker.classList.add("active");
    
    // Render Bottom Sheet details
    renderBottomSheet(cafe);
    bottomSheet.classList.add("open");
}

// Render Bottom Sheet Content
function renderBottomSheet(cafe) {
    const stats = getCafeStats(cafe);
    
    let congestionText = "여유로움 (공부/작업 추천)";
    let congestionClass = "low";
    if (cafe.congestion === "mid") {
        congestionText = "보통 (평범한 소음)";
        congestionClass = "mid";
    } else if (cafe.congestion === "high") {
        congestionText = "혼잡함 (다소 시끌벅적함)";
        congestionClass = "high";
    }

    // Check if the cafe has a 2nd floor
    const hasSecondFloor = cafe.seats.some(s => s.floor === 2);
    
    let floorPlansHtml = `
        <!-- Floor 1 Box -->
        <div class="floor-plan-box">
            <div class="floor-plan-box-title">
                <span class="material-symbols-outlined">layers</span>
                <span>1층 (1F) 좌석 배치</span>
            </div>
            <div class="floor-plan-grid" id="floor-plan-grid-f1"></div>
        </div>
    `;

    if (hasSecondFloor) {
        floorPlansHtml += `
            <!-- Floor 2 Box -->
            <div class="floor-plan-box">
                <div class="floor-plan-box-title">
                    <span class="material-symbols-outlined">layers</span>
                    <span>2층 (2F) 좌석 배치</span>
                </div>
                <div class="floor-plan-grid" id="floor-plan-grid-f2"></div>
            </div>
        `;
    }

    const sheetContent = document.getElementById("sheet-content");
    sheetContent.innerHTML = `
        <div class="sheet-left">
            <h2 style="font-size: 24px; font-weight: 800; color: var(--color-primary);">${cafe.name}</h2>
            <div style="display: flex; gap: 8px; align-items: center; font-size: 14px; font-weight: 700;">
                <span class="material-symbols-outlined star-icon">star</span>
                <span>${cafe.rating}</span>
                <span style="color: var(--color-secondary); font-weight: 400; margin-left: 8px;">${cafe.distance}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); margin-top: var(--spacing-xs); font-size: 14px; color: var(--color-primary-light);">
                <p><span class="material-symbols-outlined" style="font-size: 18px; margin-right: 8px; vertical-align: bottom;">location_on</span>${cafe.address}</p>
                <p><span class="material-symbols-outlined" style="font-size: 18px; margin-right: 8px; vertical-align: bottom;">schedule</span>영업시간: ${cafe.hours}</p>
                <p><span class="material-symbols-outlined" style="font-size: 18px; margin-right: 8px; vertical-align: bottom;">local_parking</span>주차장: ${cafe.parking ? '있음 (무료 주차 2시간)' : '없음 (인근 공영주차장 이용)'}</p>
                <p><span class="material-symbols-outlined" style="font-size: 18px; margin-right: 8px; vertical-align: bottom;">group</span>실시간 혼잡도: <span class="congestion-badge ${congestionClass}" style="margin-left: 4px;">${congestionText}</span></p>
            </div>
            
            <div style="background-color: var(--color-bg-base); padding: var(--spacing-md); border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-top: var(--spacing-sm);">
                <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 6px;">실시간 콘센트 및 좌석 요약</h4>
                <p class="plug-stats-summary" style="font-size: 14px; font-weight: 700; color: var(--color-status-free); margin-bottom: 0;">🔌 콘센트 좌석: 총 ${stats.totalPlugCount}석 중 현재 ${stats.freePlugCount}석 비어있음</p>
                <p class="total-stats-summary" style="font-size: 13px; font-weight: 700; color: var(--color-secondary); margin-top: 8px;">🪑 전체 일반 좌석: 총 ${stats.totalSeats}석 중 현재 ${stats.freeSeatsCount}석 비어있음</p>
                <span style="font-size: 11px; color: var(--color-secondary); display: block; margin-top: 6px;">* 좌석 배치도의 좌석을 직접 터치해 가상 점유 상태를 토글할 수 있습니다.</span>
            </div>
            
            <button class="share-btn" onclick="shareCafeSeatStatus(${cafe.id})">
                <span class="material-symbols-outlined">share</span>
                <span>실시간 좌석현황 공유하기</span>
            </button>
        </div>
        
        <div class="sheet-right">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm); flex-wrap: wrap; gap: 8px;">
                <div class="floor-plan-title" style="margin: 0; display: flex; align-items: center; gap: 6px;">
                    <span class="material-symbols-outlined">chair</span>
                    <span>실시간 좌석 배치도 (Floor Plan)</span>
                </div>
            </div>
            <div class="floor-plan-legend" style="margin-bottom: var(--spacing-md);">
                <div class="legend-item"><div class="legend-color free"></div><span>이용 가능</span></div>
                <div class="legend-item"><div class="legend-color busy"></div><span>사용 중</span></div>
                <div class="legend-item"><div class="legend-color no-plug"></div><span>콘센트 없음</span></div>
            </div>
            
            ${floorPlansHtml}
        </div>
    `;

    renderFloorPlanGrid(cafe, 1, "floor-plan-grid-f1");
    if (hasSecondFloor) {
        renderFloorPlanGrid(cafe, 2, "floor-plan-grid-f2");
    }
}

// Render Floor Plan Grid
function renderFloorPlanGrid(cafe, floorNum, targetGridId) {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;
    grid.innerHTML = "";

    // Filter elements belonging to the specific floor
    const floorElements = cafe.seats.filter(s => s.floor === floorNum);

    floorElements.forEach((element) => {
        const cell = document.createElement("div");
        
        if (element.type === "wall") {
            cell.setAttribute("class", "floor-element wall");
            cell.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">grid_view</span>';
        } else if (element.type === "counter") {
            const spanClass = element.span ? `span-${element.span}` : "span-3";
            cell.setAttribute("class", `floor-element counter ${spanClass}`);
            cell.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 14px; margin-bottom: 2px;">storefront</span>
                <span style="font-size: 9px; font-weight: 800; line-height: 1; white-space: nowrap;">카운터</span>
            `;
        } else if (element.type === "empty") {
            cell.setAttribute("class", "floor-element");
            cell.style.visibility = "hidden";
        } else if (element.type === "table") {
            const spanClass = element.span ? `span-${element.span}` : "span-1";
            cell.setAttribute("class", `floor-element table ${spanClass}`);
            cell.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 16px; margin-bottom: 2px;">coffee</span>
                <span style="font-size: 8px; font-weight: 800; opacity: 0.85;">테이블</span>
            `;
        } else if (element.type === "seat") {
            const statusClass = element.occupied ? "busy" : "free";
            const plugClass = element.plugged ? "plugged" : "";
            const shapeClass = element.shape ? `${element.shape}-seat` : "square-seat";
            const spanClass = element.span ? `span-${element.span}` : "span-1";
            
            cell.setAttribute("class", `floor-element seat ${statusClass} ${plugClass} ${shapeClass} ${spanClass}`);
            cell.setAttribute("title", `${element.label} (${element.plugged ? "콘센트 있음" : "콘센트 없음"})`);
            
            let shapeIcon = "chair";
            if (element.shape === "sofa") shapeIcon = "chair_alt";
            else if (element.shape === "communal") shapeIcon = "table_restaurant";
            
            // Clean label of floor prefixes
            const cleanLabel = element.label.replace("1층 ", "").replace("2층 ", "");
            const labelParts = cleanLabel.split(" ");
            let labelContentHtml = "";
            
            if (labelParts.length > 1) {
                labelContentHtml = labelParts.map(part => `
                    <div style="font-size: 7.5px; line-height: 1; font-weight: 800; white-space: nowrap; text-align: center; width: 100%; margin: 0; padding: 0;">
                        ${part}
                    </div>
                `).join("");
            } else {
                labelContentHtml = `
                    <div style="font-size: 8px; line-height: 1; font-weight: 800; white-space: nowrap; text-align: center; width: 100%; margin: 0; padding: 0;">
                        ${cleanLabel}
                    </div>
                `;
            }
            
            let plugBadgeHtml = "";
            if (element.plugged) {
                const plugsCount = element.span || 1;
                plugBadgeHtml = `
                    <div style="position: absolute; bottom: 2px; right: 2px; display: flex; align-items: center; background: var(--color-primary); color: #FFF; border-radius: 4px; padding: 1px 2px; font-size: 8px; font-weight: 800; line-height: 1; pointer-events: none; border: 0.5px solid rgba(255,255,255,0.4);">
                        <span class="material-symbols-outlined" style="font-size: 8.5px; margin-right: 0.5px; font-weight: 800; display: inline-block; vertical-align: middle;">power</span>
                        ${plugsCount > 1 ? `<span style="font-size: 7.5px; vertical-align: middle;">${plugsCount}</span>` : ""}
                    </div>
                `;
            }
            
            cell.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 13px; opacity: 0.85; margin-bottom: 1px;">${shapeIcon}</span>
                ${labelContentHtml}
                ${plugBadgeHtml}
            `;
            
            // Seat Click Interactivity (Toggle Busy/Free)
            cell.addEventListener("click", async () => {
                const newOccupiedState = !element.occupied;
                try {
                    const res = await fetch('/api/seats/toggle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            cafeId: cafe.id,
                            seatKey: element.id,
                            floor: element.floor || 1,
                            occupied: newOccupiedState
                        })
                    });
                    const result = await res.json();
                    
                    if (result.success) {
                        element.occupied = newOccupiedState;
                        
                        const hasSecondFloor = cafe.seats.some(s => s.floor === 2);
                        renderFloorPlanGrid(cafe, 1, "floor-plan-grid-f1");
                        if (hasSecondFloor) {
                            renderFloorPlanGrid(cafe, 2, "floor-plan-grid-f2");
                        }
                        
                        // Update statistics paragraphs dynamically
                        const stats = getCafeStats(cafe);
                        const statsSummary = document.querySelector(".plug-stats-summary");
                        if (statsSummary) {
                            statsSummary.innerText = `🔌 콘센트 좌석: 총 ${stats.totalPlugCount}석 중 현재 ${stats.freePlugCount}석 비어있음`;
                        }
                        const totalSummary = document.querySelector(".total-stats-summary");
                        if (totalSummary) {
                            totalSummary.innerText = `🪑 전체 일반 좌석: 총 ${stats.totalSeats}석 중 현재 ${stats.freeSeatsCount}석 비어있음`;
                        }
                        
                        // Refresh user rewards points
                        if (result.currentPoints !== undefined) {
                            const pointsEl = document.getElementById("user-points");
                            if (pointsEl) {
                                pointsEl.innerText = `${result.currentPoints.toLocaleString()} P`;
                                pointsEl.classList.add("points-updated");
                                setTimeout(() => pointsEl.classList.remove("points-updated"), 600);
                            }
                        }
                        
                        // Show toast notification if points earned
                        if (result.earnedPoints > 0) {
                            showToast(`좌석 이용으로 +${result.earnedPoints} P 적립! 🎉`);
                        }
                        
                        renderCafeList();
                        renderMap();
                    }
                } catch (err) {
                    console.error("Failed to update seat occupancy status:", err);
                }
            });
        }
        
        grid.appendChild(cell);
    });
}

// Close Bottom Sheet
function closeBottomSheet() {
    bottomSheet.classList.remove("open");
    selectedCafe = null;
    document.querySelectorAll(".cafe-card").forEach(c => c.classList.remove("active"));
    document.querySelectorAll(".map-marker").forEach(m => m.classList.remove("active"));
    renderCafeList();
}

// Set up event listeners
function setupEventListeners() {
    // Search input handler
    searchInput.addEventListener("input", (e) => {
        currentFilters.searchQuery = e.target.value;
        renderCafeList();
    });

    // Filter Buttons
    filterManyPlugs.addEventListener("click", () => {
        filterManyPlugs.classList.toggle("active");
        currentFilters.manyPlugs = filterManyPlugs.classList.contains("active");
        renderCafeList();
    });

    filterQuiet.addEventListener("click", () => {
        filterQuiet.classList.toggle("active");
        currentFilters.quietOnly = filterQuiet.classList.contains("active");
        renderCafeList();
    });

    filterParking.addEventListener("click", () => {
        filterParking.classList.toggle("active");
        currentFilters.parking = filterParking.classList.contains("active");
        renderCafeList();
    });

    // Map Zoom & Pan event listeners
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    mapSvg.addEventListener("wheel", (e) => {
        e.preventDefault();
        
        const zoomFactor = 1.1;
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        
        // Calculate SVG coordinates under mouse before zoom
        const svgX = viewX + (mouseX / mapSvg.clientWidth) * (viewWidth * zoom);
        const svgY = viewY + (mouseY / mapSvg.clientHeight) * (viewHeight * zoom);
        
        if (e.deltaY < 0) {
            // Zoom in
            zoom /= zoomFactor;
        } else {
            // Zoom out
            zoom *= zoomFactor;
        }
        
        // Bound zoom level between 0.35 and 2.5
        zoom = Math.max(0.35, Math.min(2.5, zoom));
        
        // Recalculate viewX and viewY to keep mouse point stationary
        viewX = svgX - (mouseX / mapSvg.clientWidth) * (viewWidth * zoom);
        viewY = svgY - (mouseY / mapSvg.clientHeight) * (viewHeight * zoom);
        
        // Boundaries
        viewX = Math.max(-200, Math.min(1000, viewX));
        viewY = Math.max(-200, Math.min(700, viewY));
        
        updateViewBox();
    });

    mapSvg.addEventListener("mousedown", (e) => {
        // Drag map on background clicks
        if (e.target.tagName === "svg" || e.target.tagName === "rect" || e.target.tagName === "path" || e.target.tagName === "line") {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    mapSvg.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Convert screen delta to SVG delta
            const svgDx = (dx / mapSvg.clientWidth) * (viewWidth * zoom);
            const svgDy = (dy / mapSvg.clientHeight) * (viewHeight * zoom);
            
            viewX -= svgDx;
            viewY -= svgDy;
            
            startX = e.clientX;
            startY = e.clientY;
            
            updateViewBox();
        }
    });

    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    function updateViewBox() {
        mapSvg.setAttribute("viewBox", `${viewX} ${viewY} ${viewWidth * zoom} ${viewHeight * zoom}`);
    }
}



// Run application on load
window.onload = init;

// AI Chatbot Client Side Interactivity
let chatHistory = [
    {
        role: "model",
        parts: [{ text: `안녕하세요! 플러그인 카페 AI 비서입니다. 🔌🤖\n실시간 데이터베이스를 바탕으로 신촌 인근의 작업하기 좋은 카페를 추천해 드릴게요.\n예시: "콘센트 자리가 제일 많은 곳은 어디야?", "주차장 있고 한적한 카페 있어?"` }]
    }
];

function toggleAiChat() {
    const chatCard = document.getElementById("ai-chat-card");
    if (chatCard) {
        chatCard.classList.toggle("active");
    }
}

async function sendChatMessage() {
    const input = document.getElementById("chat-input");
    const container = document.getElementById("chat-messages");
    if (!input || !container || !input.value.trim()) return;

    const userMessageText = input.value.trim();
    input.value = ""; // Clear input immediately

    // Append User Message Bubble
    appendMessageBubble("user", userMessageText);
    
    // Track conversation history
    chatHistory.push({
        role: "user",
        parts: [{ text: userMessageText }]
    });
    
    // Add Typing Indicator Spinner
    const spinner = document.createElement("div");
    spinner.id = "chat-typing-indicator";
    spinner.className = "typing-indicator";
    spinner.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    container.appendChild(spinner);
    container.scrollTop = container.scrollHeight;

    try {
        const res = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: userMessageText,
                history: chatHistory
            })
        });
        const data = await res.json();
        
        // Remove Typing Indicator
        const existingSpinner = document.getElementById("chat-typing-indicator");
        if (existingSpinner) existingSpinner.remove();

        if (data.reply) {
            appendMessageBubble("bot", data.reply);
            
            // Track model response in history
            chatHistory.push({
                role: "model",
                parts: [{ text: data.reply }]
            });
            
            // Update rewards if coupon was issued or points changed
            if (data.couponIssued) {
                await loadUserRewards();
                showToast(`새 쿠폰 발급 완료! (보너스 +100 P 적립) 🎟️`);
                // Open coupons list to showcase the new coupon
                const dropdown = document.getElementById("coupons-dropdown");
                if (dropdown && !dropdown.classList.contains("open")) {
                    dropdown.classList.add("open");
                }
            } else if (data.points !== undefined) {
                await loadUserRewards();
            }
        } else {
            appendMessageBubble("bot", "죄송합니다. 추천 비서와 일시적으로 연결할 수 없습니다. 😢");
        }
    } catch (err) {
        console.error("AI Chat Error:", err);
        const existingSpinner = document.getElementById("chat-typing-indicator");
        if (existingSpinner) existingSpinner.remove();
        appendMessageBubble("bot", "네트워크 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
}

function appendMessageBubble(sender, text) {
    const container = document.getElementById("chat-messages");
    if (!container) return;

    const bubble = document.createElement("div");
    bubble.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
    
    // HTML safe escape to prevent XSS while converting double newlines to paragraph breaks
    const safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");

    bubble.innerHTML = safeText;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

// Global Toast Notification Helper
function showToast(message) {
    let toast = document.getElementById("toast-container");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-container";
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(78, 52, 46, 0.95);
            color: #FFF;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 8px 30px rgba(0,0,0,0.25);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px; color: #FFD54F;">stars</span> ${message}`;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(-10px)";
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 2800);
}

// Quick suggestion chip trigger handler
async function handleSuggestionClick(text) {
    const input = document.getElementById("chat-input");
    if (input) {
        input.value = text;
        await sendChatMessage();
    }
}

// Share cafe seat status URL copier
function shareCafeSeatStatus(cafeId) {
    const cafe = cafes.find(c => c.id === cafeId);
    if (!cafe) return;

    const stats = getCafeStats(cafe);
    const shareUrl = `${window.location.origin}${window.location.pathname}?cafe=${cafe.id}`;
    
    const textToCopy = `🔌 [Plug-In Cafe] ${cafe.name} 실시간 좌석 현황 공유
📍 주소: ${cafe.address}
⚡ 콘센트 석: 총 ${stats.totalPlugCount}석 중 ${stats.freePlugCount}석 이용 가능!
🪑 전체 좌석: 총 ${stats.totalSeats}석 중 ${stats.freeSeatsCount}석 이용 가능!

👉 실시간 도면 확인하기: ${shareUrl}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("실시간 좌석현황이 클립보드에 복사되었습니다! 📋");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        // Fallback for older or restricted web environments
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast("실시간 좌석현황이 복사되었습니다! 📋");
        } catch (e) {
            alert("복사에 실패했습니다. 수동으로 주소를 복사해 주세요.");
        }
        document.body.removeChild(textarea);
    });
}
