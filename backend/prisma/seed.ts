import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.service.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  await prisma.user.create({
    data: {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@marketplace.com',
      role: 'ADMIN',
    },
  });

  // Create Vendors
  const vendor1 = await prisma.user.create({
    data: {
      id: 'vendor-001',
      name: 'Rahim Cleaning Services',
      email: 'rahim@vendor.com',
      role: 'VENDOR',
      vendorProfile: {
        create: {
          bio: 'Professional home cleaning with 10 years of experience.',
          phone: '01711-000001',
        },
      },
    },
    include: { vendorProfile: true },
  });

  const vendor2 = await prisma.user.create({
    data: {
      id: 'vendor-002',
      name: 'Karim Plumbing Co.',
      email: 'karim@vendor.com',
      role: 'VENDOR',
      vendorProfile: {
        create: {
          bio: 'Expert plumbing solutions for home and office.',
          phone: '01711-000002',
        },
      },
    },
    include: { vendorProfile: true },
  });

  const vendor3 = await prisma.user.create({
    data: {
      id: 'vendor-003',
      name: 'Jamal AC & Appliance',
      email: 'jamal@vendor.com',
      role: 'VENDOR',
      vendorProfile: {
        create: {
          bio: 'AC installation, repair, and maintenance specialists.',
          phone: '01711-000003',
        },
      },
    },
    include: { vendorProfile: true },
  });

  // Create End-User
  const endUser = await prisma.user.create({
    data: {
      id: 'user-001',
      name: 'Fatema Begum',
      email: 'fatema@user.com',
      role: 'END_USER',
    },
  });

  // Create Services
  const s1 = await prisma.service.create({
    data: {
      vendorProfileId: vendor1.vendorProfile!.id,
      name: 'Deep Home Cleaning',
      description: 'Full home deep cleaning including kitchen, bathrooms, and all rooms.',
      price: 1500,
      category: 'Cleaning',
    },
  });

  const s2 = await prisma.service.create({
    data: {
      vendorProfileId: vendor1.vendorProfile!.id,
      name: 'Office Cleaning',
      description: 'Professional office and commercial space cleaning service.',
      price: 2500,
      category: 'Cleaning',
    },
  });

  const s3 = await prisma.service.create({
    data: {
      vendorProfileId: vendor2.vendorProfile!.id,
      name: 'Pipe Leak Repair',
      description: 'Fix leaking pipes and water connections quickly.',
      price: 800,
      category: 'Plumbing',
    },
  });

  const s4 = await prisma.service.create({
    data: {
      vendorProfileId: vendor2.vendorProfile!.id,
      name: 'Bathroom Fitting',
      description: 'Complete bathroom plumbing and fixture installation.',
      price: 3500,
      category: 'Plumbing',
    },
  });

  await prisma.service.create({
    data: {
      vendorProfileId: vendor3.vendorProfile!.id,
      name: 'AC Installation',
      description: 'Professional split/window AC installation with warranty.',
      price: 2000,
      category: 'AC Repair',
    },
  });

  await prisma.service.create({
    data: {
      vendorProfileId: vendor3.vendorProfile!.id,
      name: 'AC Servicing',
      description: 'Full AC cleaning, gas refill, and performance check.',
      price: 1200,
      category: 'AC Repair',
    },
  });

  await prisma.service.create({
    data: {
      vendorProfileId: vendor1.vendorProfile!.id,
      name: 'Carpet & Sofa Cleaning',
      description: 'Steam cleaning for carpets, sofas, and upholstery.',
      price: 1800,
      category: 'Cleaning',
    },
  });

  await prisma.service.create({
    data: {
      vendorProfileId: vendor2.vendorProfile!.id,
      name: 'Water Tank Cleaning',
      description: 'Roof-top and underground water tank cleaning and disinfection.',
      price: 1000,
      category: 'Plumbing',
    },
  });

  // Add a sample transaction for End-User
  await prisma.transaction.create({
    data: {
      userId: endUser.id,
      serviceId: s1.id,
      amount: 1500,
      status: 'SUCCESS',
      paymentMethod: 'bKash',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: endUser.id,
      serviceId: s3.id,
      amount: 800,
      status: 'SUCCESS',
      paymentMethod: 'Card',
    },
  });

  console.log('✅ Seed data inserted successfully!');
  console.log('👤 Admin: admin@marketplace.com');
  console.log('🏪 Vendors: rahim@vendor.com, karim@vendor.com, jamal@vendor.com');
  console.log('🙍 End-User: fatema@user.com');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
