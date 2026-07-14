// Mock Data for Cafe Plug Finder
const cafes = [
    {
        id: 1,
        name: "모카 라떼 하우스",
        rating: 4.8,
        distance: "150m",
        address: "서울 마포구 와우산로 21길 12",
        hours: "09:00 - 22:00",
        parking: true,
        congestion: "low", // low (여유), mid (보통), high (혼잡)
        x: 250, // SVG map X
        y: 180, // SVG map Y
        logoUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&auto=format&fit=crop&q=80",
        seats: [
            { id: "S1", type: "seat", plugged: true, occupied: false, label: "창가 01" },
            { id: "S2", type: "seat", plugged: true, occupied: false, label: "창가 02" },
            { id: "S3", type: "seat", plugged: true, occupied: true, label: "창가 03" },
            { id: "W1", type: "wall" },
            { id: "W2", type: "wall" },
            { id: "C1", type: "counter" },
            { id: "E1", type: "empty" },
            { id: "E2", type: "empty" },
            { id: "S4", type: "seat", plugged: true, occupied: false, label: "테이블 01" },
            { id: "S5", type: "seat", plugged: false, occupied: false, label: "테이블 02" },
            { id: "S6", type: "seat", plugged: false, occupied: true, label: "테이블 03" },
            { id: "S7", type: "seat", plugged: true, occupied: true, label: "테이블 04" },
            { id: "S8", type: "seat", plugged: true, occupied: false, label: "소파 01" },
            { id: "S9", type: "seat", plugged: true, occupied: false, label: "소파 02" },
            { id: "S10", type: "seat", plugged: false, occupied: false, label: "소파 03" },
            { id: "S11", type: "seat", plugged: false, occupied: true, label: "소파 04" },
        ]
    },
    {
        id: 2,
        name: "스타벅스 홍대공항철도역점",
        rating: 4.5,
        distance: "320m",
        address: "서울 마포구 양화로 188",
        hours: "07:00 - 23:00",
        parking: false,
        congestion: "high",
        x: 480,
        y: 350,
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg",
        seats: [
            { id: "S1", type: "seat", plugged: true, occupied: true, label: "센터 01" },
            { id: "S2", type: "seat", plugged: true, occupied: true, label: "센터 02" },
            { id: "S3", type: "seat", plugged: true, occupied: true, label: "센터 03" },
            { id: "S4", type: "seat", plugged: true, occupied: true, label: "센터 04" },
            { id: "C1", type: "counter" },
            { id: "W1", type: "wall" },
            { id: "S5", type: "seat", plugged: true, occupied: false, label: "창가 01" },
            { id: "S6", type: "seat", plugged: true, occupied: true, label: "창가 02" },
            { id: "S7", type: "seat", plugged: false, occupied: true, label: "2인석 01" },
            { id: "S8", type: "seat", plugged: false, occupied: true, label: "2인석 02" },
            { id: "S9", type: "seat", plugged: true, occupied: true, label: "스터디 01" },
            { id: "S10", type: "seat", plugged: true, occupied: false, label: "스터디 02" },
        ]
    },
    {
        id: 3,
        name: "커피랩 팩토리",
        rating: 4.9,
        distance: "450m",
        address: "서울 마포구 와우산로29길 4-13",
        hours: "10:00 - 21:00",
        parking: true,
        congestion: "mid",
        x: 650,
        y: 190,
        logoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&auto=format&fit=crop&q=80",
        seats: [
            { id: "S1", type: "seat", plugged: true, occupied: false, label: "바 01" },
            { id: "S2", type: "seat", plugged: true, occupied: false, label: "바 02" },
            { id: "S3", type: "seat", plugged: true, occupied: false, label: "바 03" },
            { id: "S4", type: "seat", plugged: true, occupied: true, label: "바 04" },
            { id: "E1", type: "empty" },
            { id: "C1", type: "counter" },
            { id: "S5", type: "seat", plugged: false, occupied: false, label: "테라스 01" },
            { id: "S6", type: "seat", plugged: false, occupied: false, label: "테라스 02" },
            { id: "S7", type: "seat", plugged: true, occupied: true, label: "작업대 01" },
            { id: "S8", type: "seat", plugged: true, occupied: false, label: "작업대 02" },
        ]
    },
    {
        id: 4,
        name: "할리스 커피 신촌점",
        rating: 4.2,
        distance: "600m",
        address: "서울 서대문구 연세로 34",
        hours: "00:00 - 24:00",
        parking: false,
        congestion: "mid",
        x: 720,
        y: 420,
        logoUrl: "https://www.hollys.co.kr/websrc/images/layout/logo_210302.gif",
        seats: [
            { id: "S1", type: "seat", plugged: true, occupied: true, label: "1층 01" },
            { id: "S2", type: "seat", plugged: true, occupied: false, label: "1층 02" },
            { id: "S3", type: "seat", plugged: false, occupied: false, label: "1층 03" },
            { id: "S4", type: "seat", plugged: false, occupied: true, label: "1층 04" },
            { id: "C1", type: "counter" },
            { id: "W1", type: "wall" },
            { id: "S5", type: "seat", plugged: true, occupied: false, label: "2층 01" },
            { id: "S6", type: "seat", plugged: true, occupied: true, label: "2층 02" },
            { id: "S7", type: "seat", plugged: true, occupied: false, label: "2층 03" },
            { id: "S8", type: "seat", plugged: true, occupied: true, label: "2층 04" },
            { id: "S9", type: "seat", plugged: true, occupied: false, label: "2층 05" },
            { id: "S10", type: "seat", plugged: true, occupied: true, label: "2층 06" },
        ]
    },
    {
        id: 5,
        name: "오브젝트 카페",
        rating: 4.6,
        distance: "820m",
        address: "서울 마포구 와우산로37길 13",
        hours: "11:00 - 22:00",
        parking: true,
        congestion: "low",
        x: 180,
        y: 460,
        logoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80",
        seats: [
            { id: "S1", type: "seat", plugged: true, occupied: false, label: "A-1" },
            { id: "S2", type: "seat", plugged: true, occupied: false, label: "A-2" },
            { id: "S3", type: "seat", plugged: false, occupied: false, label: "B-1" },
            { id: "S4", type: "seat", plugged: false, occupied: false, label: "B-2" },
            { id: "C1", type: "counter" },
            { id: "E1", type: "empty" },
            { id: "S5", type: "seat", plugged: true, occupied: false, label: "C-1" },
            { id: "S6", type: "seat", plugged: true, occupied: true, label: "C-2" },
        ]
    }
];

let selectedCafe = null;
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
function init() {
    renderMap();
    renderCafeList();
    setupEventListeners();
}

// Compute seat statistics
function getCafeStats(cafe) {
    const plugSeats = cafe.seats.filter(s => s.type === "seat" && s.plugged);
    const freePlugSeats = plugSeats.filter(s => !s.occupied);
    const totalPlugCount = plugSeats.length;
    const freePlugCount = freePlugSeats.length;
    
    // Many plugs = 50% or more of total seats have plugs, or total plugs >= 6
    const totalSeats = cafe.seats.filter(s => s.type === "seat").length;
    const plugRatio = totalSeats > 0 ? (totalPlugCount / totalSeats) : 0;
    const isManyPlugs = plugRatio >= 0.5 || totalPlugCount >= 6;
    
    return {
        freePlugCount,
        totalPlugCount,
        isManyPlugs,
        totalSeats
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
        
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", cafe.logoUrl);
        image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", cafe.logoUrl);
        image.setAttribute("x", "-11");
        image.setAttribute("y", "-31");
        image.setAttribute("width", "22");
        image.setAttribute("height", "22");
        image.setAttribute("clip-path", "url(#pin-circle-clip)");
        image.setAttribute("preserveAspectRatio", "xMidYMid slice");
        marker.appendChild(image);
        
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
        marker.appendChild(icon);
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
            <div class="cafe-card-header">
                <h3 class="cafe-title">${cafe.name}</h3>
                <div class="cafe-rating">
                    <span class="material-symbols-outlined star-icon">star</span>
                    <span>${cafe.rating}</span>
                </div>
            </div>
            <div class="cafe-meta">
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
    
    // Sync Simulation Console Controls
    syncSimulationPanel(cafe);
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
                <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 4px;">실시간 콘센트 요약</h4>
                <p style="font-size: 15px; font-weight: 700; color: var(--color-status-free);">총 ${stats.totalPlugCount}개의 콘센트 좌석 중 현재 ${stats.freePlugCount}석 비어있음</p>
                <span style="font-size: 11px; color: var(--color-secondary); display: block; margin-top: 4px;">* 좌석 배치도의 좌석을 직접 터치해 가상 점유 상태를 토글할 수 있습니다.</span>
            </div>
        </div>
        
        <div class="sheet-right">
            <div class="floor-plan-title">
                <span class="material-symbols-outlined">chair</span>
                <span>실시간 좌석 배치도 (Floor Plan)</span>
            </div>
            <div class="floor-plan-legend">
                <div class="legend-item"><div class="legend-color free"></div><span>이용 가능</span></div>
                <div class="legend-item"><div class="legend-color busy"></div><span>사용 중</span></div>
                <div class="legend-item"><div class="legend-color no-plug"></div><span>콘센트 없음</span></div>
            </div>
            
            <div class="floor-plan-grid" id="floor-plan-grid">
                <!-- Javascript will render grid cells here -->
            </div>
        </div>
    `;

    renderFloorPlanGrid(cafe);
}

// Render Floor Plan Grid
function renderFloorPlanGrid(cafe) {
    const grid = document.getElementById("floor-plan-grid");
    grid.innerHTML = "";

    cafe.seats.forEach((element) => {
        const cell = document.createElement("div");
        
        if (element.type === "wall") {
            cell.setAttribute("class", "floor-element wall");
            cell.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">grid_view</span>';
        } else if (element.type === "counter") {
            cell.setAttribute("class", "floor-element counter");
            cell.innerText = "COUNTER / 카운터";
        } else if (element.type === "empty") {
            cell.setAttribute("class", "floor-element");
            cell.style.visibility = "hidden";
        } else if (element.type === "seat") {
            const statusClass = element.occupied ? "busy" : "free";
            const plugClass = element.plugged ? "plugged" : "";
            
            cell.setAttribute("class", `floor-element seat ${statusClass} ${plugClass}`);
            cell.setAttribute("title", `${element.label} (${element.plugged ? "콘센트 있음" : "콘센트 없음"})`);
            cell.innerHTML = `<span>${element.label}</span>`;
            
            // Seat Click Interactivity (Toggle Busy/Free)
            cell.addEventListener("click", () => {
                element.occupied = !element.occupied;
                renderFloorPlanGrid(cafe);
                renderBottomSheet(cafe);
                renderCafeList();
                renderMap();
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

// Sync Simulation Console with the selected cafe
function syncSimulationPanel(cafe) {
    document.querySelectorAll(".sim-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-congestion") === cafe.congestion) {
            btn.classList.add("active");
        }
    });
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

    // Simulation Console Congestion Buttons
    document.querySelectorAll(".sim-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            if (!selectedCafe) {
                alert("상태를 변경할 카페를 먼저 지도나 목록에서 선택해 주세요!");
                return;
            }
            const congestion = e.target.getAttribute("data-congestion");
            selectedCafe.congestion = congestion;
            
            // Auto-adjust seat occupancy according to congestion level
            adjustSeatsForCongestion(selectedCafe, congestion);
            
            // Refresh views
            syncSimulationPanel(selectedCafe);
            renderBottomSheet(selectedCafe);
            renderCafeList();
            renderMap();
        });
    });
}

// Adjust seats based on chosen congestion level
function adjustSeatsForCongestion(cafe, congestion) {
    let targetRatio = 0.2; // low
    if (congestion === "mid") targetRatio = 0.6;
    else if (congestion === "high") targetRatio = 0.9;
    
    cafe.seats.forEach(seat => {
        if (seat.type === "seat") {
            seat.occupied = Math.random() < targetRatio;
        }
    });
}

// Randomize active cafe seat occupancy from Simulation Panel
function triggerRandomSimulation() {
    if (!selectedCafe) {
        // Randomize all cafes if none selected
        cafes.forEach(c => {
            c.seats.forEach(seat => {
                if (seat.type === "seat") {
                    seat.occupied = Math.random() > 0.5;
                }
            });
            // Update congestion based on ratio
            const seats = c.seats.filter(s => s.type === "seat");
            const occupied = seats.filter(s => s.occupied).length;
            const ratio = occupied / seats.length;
            if (ratio < 0.4) c.congestion = "low";
            else if (ratio < 0.75) c.congestion = "mid";
            else c.congestion = "high";
        });
        renderCafeList();
        renderMap();
    } else {
        // Randomize only selected cafe
        selectedCafe.seats.forEach(seat => {
            if (seat.type === "seat") {
                seat.occupied = Math.random() > 0.5;
            }
        });
        // Recalculate congestion
        const seats = selectedCafe.seats.filter(s => s.type === "seat");
        const occupied = seats.filter(s => s.occupied).length;
        const ratio = occupied / seats.length;
        if (ratio < 0.4) selectedCafe.congestion = "low";
        else if (ratio < 0.75) selectedCafe.congestion = "mid";
        else selectedCafe.congestion = "high";
        
        syncSimulationPanel(selectedCafe);
        renderBottomSheet(selectedCafe);
        renderCafeList();
        renderMap();
    }
}

// Run application on load
window.onload = init;
