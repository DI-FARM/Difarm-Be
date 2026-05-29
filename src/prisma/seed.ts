import { PrismaClient, Roles, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const seedUsers = [
  {
    role: Roles.SUPERADMIN,
    username: 'superadmin',
    email: 'superadmin@difarm.local',
    phone: '+250700000001',
    password: 'SuperAdmin1',
    fullname: 'Super Administrator',
    gender: Gender.MALE,
  },
  {
    role: Roles.ADMIN,
    username: 'admin',
    email: 'admin@difarm.local',
    phone: '+250700000002',
    password: 'AdminPass1',
    fullname: 'Farm Administrator',
    gender: Gender.MALE,
  },
  {
    role: Roles.MANAGER,
    username: 'manager',
    email: 'manager@difarm.local',
    phone: '+250700000003',
    password: 'ManagerPass1',
    fullname: 'Farm Manager',
    gender: Gender.MALE,
  },
];

async function main() {
  console.log('Seeding users by role...');

  for (const u of seedUsers) {
    const existing = await prisma.account.findUnique({
      where: { username: u.username },
    });
    if (existing) {
      console.log(`  Skip ${u.role}: account "${u.username}" already exists.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS);

    const account = await prisma.account.create({
      data: {
        username: u.username,
        email: u.email,
        phone: u.phone,
        role: u.role,
        password: hashedPassword,
        status: true,
      },
    });

    await prisma.user.create({
      data: {
        accountId: account.id,
        fullname: u.fullname,
        gender: u.gender,
      },
    });

    console.log(`  Created ${u.role}: ${u.username} (password: ${u.password})`);
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
