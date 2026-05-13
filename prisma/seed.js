import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = [
  { name: "She Blooms Graphic Tee", tagline: "Oversized · Lavender / White / Black", price: 2200, category: "tees", colors: JSON.stringify(["#E8DEFF", "#FDFAF5", "#1A1625"]), badge: "New", icon: "👕", description: "Soft ring-spun cotton.", inventory: 50 },
  { name: "Malvie Logo Tee", tagline: "Oversized · Black / White", price: 2200, category: "tees", colors: JSON.stringify(["#1A1625", "#FDFAF5"]), badge: "Bestseller", icon: "👕", description: "Minimal logo print.", inventory: 100 },
  { name: "Botanical Line Art Tee", tagline: "Oversized · Cream / White", price: 2400, category: "tees", colors: JSON.stringify(["#FDFAF5", "#FFFFFF"]), badge: null, icon: "👕", description: "Delicate botanical line drawing.", inventory: 75 },
  { name: "Born to Bloom Tee", tagline: "Oversized · Lavender / Black", price: 2800, category: "tees", colors: JSON.stringify(["#C4A8E8", "#1A1625"]), badge: "Limited", icon: "👕", description: "Statement typography.", inventory: 30 },
  { name: "Minimal Canvas Bag", tagline: "Everyday essential", price: 3200, category: "bags", colors: JSON.stringify(["#1A1625", "#FDFAF5"]), badge: null, icon: "👜", description: "Durable canvas tote.", inventory: 40 },
  { name: "Gold Accent Earrings", tagline: "Dainty & sophisticated", price: 1890, category: "jewelry", colors: JSON.stringify(["#C9A96E"]), badge: "Limited", icon: "✨", description: "Gold‑plated geometric earrings.", inventory: 60 },
  { name: "Silk Scarf", tagline: "Premium finish", price: 2150, category: "lifestyle", colors: JSON.stringify(["#B47DC8", "#C9A96E", "#FDFAF5"]), badge: null, icon: "🧣", description: "Soft silk blend.", inventory: 25 },
  { name: "Cream Classic Tee", tagline: "Timeless staple", price: 2200, category: "tees", colors: JSON.stringify(["#FDFAF5", "#E8DEFF"]), badge: null, icon: "👕", description: "Pure comfort, crew neck.", inventory: 80 },
  { name: "Ring Set", tagline: "Stack & shine", price: 1850, category: "jewelry", colors: JSON.stringify(["#C9A96E"]), badge: "Popular", icon: "💍", description: "Set of 3 adjustable rings.", inventory: 55 },
  { name: "Plum Oversized Shirt", tagline: "Relaxed fit elegance", price: 2800, category: "tees", colors: JSON.stringify(["#8B6BAF"]), badge: null, icon: "🎽", description: "Button‑down shirt.", inventory: 35 },
  { name: "Sunglasses", tagline: "UV protection", price: 2500, category: "lifestyle", colors: JSON.stringify(["#1A1625"]), badge: null, icon: "👓", description: "Square acetate frames.", inventory: 45 },
  { name: "Mini Pouch", tagline: "Compact & cute", price: 1200, category: "bags", colors: JSON.stringify(["#E8DEFF", "#C9A96E"]), badge: null, icon: "👝", description: "Zippered cosmetic pouch.", inventory: 90 },
  { name: "Beaded Bracelet", tagline: "Spiritual vibes", price: 1650, category: "jewelry", colors: JSON.stringify(["#B47DC8", "#E8DEFF"]), badge: "New", icon: "📿", description: "Lavender howlite & gold beads.", inventory: 70 },
  { name: "Lightweight Jacket", tagline: "Layering perfection", price: 3500, category: "tees", colors: JSON.stringify(["#FDFAF5", "#1A1625"]), badge: null, icon: "🧥", description: "Unlined cotton jacket.", inventory: 20 },
  { name: "Scented Candle", tagline: "Lavender essence", price: 1800, category: "lifestyle", colors: JSON.stringify(["#E8DEFF"]), badge: null, icon: "🕯️", description: "Soy wax candle.", inventory: 65 }
];

async function main() {
  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }
  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });