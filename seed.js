const fs = require('fs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
    console.log("Reading data from temp_app.js...");
    const content = fs.readFileSync('./temp_app.js', 'utf8');
    
    // Extract the cafes array block
    const startIdx = content.indexOf('const cafes = [');
    if (startIdx === -1) {
        throw new Error("Could not find cafes array in temp_app.js");
    }
    const endIdx = content.indexOf('];', startIdx) + 2;
    const cafesJs = content.substring(startIdx, endIdx).replace('const cafes =', 'var cafes =');
    
    // Safely evaluate the cafes declaration
    eval(cafesJs);
    
    console.log(`Extracted ${cafes.length} cafes from temp_app.js.`);
    
    // Clear existing records in cascade order
    console.log("Clearing existing data in Supabase (seats first, then cafes)...");
    await prisma.seat.deleteMany({});
    await prisma.cafe.deleteMany({});
    
    for (const cafe of cafes) {
        console.log(`Inserting cafe: ${cafe.name}...`);
        
        const newCafe = await prisma.cafe.create({
            data: {
                id: cafe.id,
                name: cafe.name,
                rating: cafe.rating,
                distance: cafe.distance,
                address: cafe.address,
                hours: cafe.hours,
                parking: cafe.parking,
                congestion: cafe.congestion,
                x: cafe.x,
                y: cafe.y,
                logoUrl: cafe.logoUrl
            }
        });
        
        console.log(`Inserting seats/layout for ${cafe.name}...`);
        const seatInserts = cafe.seats.map((seat, index) => {
            // Validate enum fields
            const type = ['seat', 'table', 'wall', 'counter', 'empty'].includes(seat.type) ? seat.type : 'empty';
            const shape = ['sofa', 'communal', 'square'].includes(seat.shape) ? seat.shape : null;
            
            return {
                cafeId: newCafe.id,
                seatKey: seat.id,
                type: type,
                plugged: seat.plugged || false,
                occupied: seat.occupied || false,
                label: seat.label || null,
                floor: seat.floor || 1,
                shape: shape,
                span: seat.span || 1,
                sortOrder: index
            };
        });
        
        await prisma.seat.createMany({
            data: seatInserts
        });
        
        console.log(`Successfully inserted ${seatInserts.length} elements.`);
    }
    
    // Remove temp file
    if (fs.existsSync('./temp_app.js')) {
        fs.unlinkSync('./temp_app.js');
    }
    console.log("Migration complete!");
}

run()
    .catch(err => {
        console.error("Migration failed:", err);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
