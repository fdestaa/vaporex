import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Hardcoded seed data to ensure it works cleanly without dealing with Vite frontend import quirks
const categories = [
  { id: 1, name: 'Pod System', slug: 'pod-system', icon: 'Box', description: 'Perangkat pod portabel & praktis' },
  { id: 2, name: 'Mod Kit', slug: 'mod-kit', icon: 'Cpu', description: 'Box mod & starter kit lengkap' },
  { id: 3, name: 'Liquid', slug: 'liquid', icon: 'Droplets', description: 'E-liquid premium berbagai rasa' },
  { id: 4, name: 'Coil & Cartridge', slug: 'coil-cartridge', icon: 'CircuitBoard', description: 'Coil pengganti & cartridge pod' },
  { id: 5, name: 'Aksesoris', slug: 'aksesoris', icon: 'Wrench', description: 'Baterai, charger, drip tip & lainnya' },
];

const products = [
  { name: 'Caliburn G2 Pod System', slug: 'caliburn-g2', description: 'Uwell Caliburn G2 features vibration interaction, progressive airflow adjustment, and pro-FOCS tech.', price: 295000, stock: 45, categoryId: 1, images: ['/products/caliburn_g2.png'] },
  { name: 'XROS 3 Mini', slug: 'xros-3-mini', description: 'Vaporesso XROS 3 Mini is the new best pod in XROS family, an extremely simple MTL pod system.', price: 250000, discountPrice: 220000, stock: 120, categoryId: 1, images: ['/products/xros3.png'] },
  { name: 'Centaurus M200 Mod', slug: 'centaurus-m200', description: 'Lost Vape Centaurus M200 Box Mod features 200W max output, dual 18650 batteries.', price: 650000, stock: 15, categoryId: 2, images: ['/products/centaurus.png'] },
  { name: 'Oat Drips V1 100ml', slug: 'oat-drips-v1', description: 'Liquid legendaris Oat Drips V1 Original dengan rasa sereal gandum dan susu manis.', price: 185000, stock: 200, categoryId: 3, images: ['/products/oatdrips.png'] },
  { name: 'Ursa Baby Pro', slug: 'ursa-baby-pro', description: 'Lost Vape Ursa Baby Pro is a top-tier level pod system featuring 25W max output.', price: 280000, stock: 0, categoryId: 1, images: ['/products/ursa.png'] },
];

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // 1. Create Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin', salt);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vaporex.id' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@vaporex.id',
      passwordHash: await bcrypt.hash('admin', salt),
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.email);

  const kasir = await prisma.user.upsert({
    where: { email: 'kasir@vaporex.id' },
    update: {},
    create: {
      name: 'Kasir Store',
      email: 'kasir@vaporex.id',
      passwordHash: await bcrypt.hash('vaporexid', salt),
      role: 'kasir',
    },
  });
  console.log('Kasir user created:', kasir.email);

  const customer = await prisma.user.upsert({
    where: { email: 'rex@vaporex.id' },
    update: {},
    create: {
      name: 'Rex Customer',
      email: 'rex@vaporex.id',
      passwordHash: await bcrypt.hash('vaporexid', salt),
      role: 'customer',
    },
  });
  console.log('Customer user created:', customer.email);

  // 2. Create Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
      }
    });
  }
  console.log('Categories seeded.');

  // 3. Create Products
  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod
    });
  }
  console.log('Products seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
