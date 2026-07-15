-- 🔌 Plug-In Cafe Supabase DDL Schema

-- 1. DROP Tables (If exist)
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS cafes;

-- 2. CREATE 'cafes' Table
CREATE TABLE cafes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 0.0,
    distance VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    hours VARCHAR(100),
    parking BOOLEAN DEFAULT FALSE,
    congestion VARCHAR(10) DEFAULT 'low',
    x INT NOT NULL,
    y INT NOT NULL,
    logo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CREATE 'seats' Table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    cafe_id INT REFERENCES cafes(id) ON DELETE CASCADE,
    seat_key VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('seat', 'table', 'wall', 'counter', 'empty')),
    plugged BOOLEAN DEFAULT FALSE,
    occupied BOOLEAN DEFAULT FALSE,
    label VARCHAR(50),
    floor INT DEFAULT 1,
    shape VARCHAR(20) CHECK (shape IN ('sofa', 'communal', 'square')),
    span INT DEFAULT 1,
    sort_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_cafe_seat_floor UNIQUE (cafe_id, seat_key, floor)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Policies (Allows anyone to read and update status for simplicity)
CREATE POLICY "Allow public read access on cafes" ON cafes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on seats" ON seats FOR SELECT USING (true);
CREATE POLICY "Allow public update access on seats" ON seats FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access on cafes" ON cafes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access on seats" ON seats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access on cafes" ON cafes FOR DELETE USING (true);
CREATE POLICY "Allow public delete access on seats" ON seats FOR DELETE USING (true);
