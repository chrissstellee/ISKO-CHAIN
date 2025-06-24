/* eslint-disable prettier/prettier */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const programs = [
    {
      name: 'Bachelor of Science in Information Technology',
      abbreviation: 'BSIT',
    },
    {
      name: 'Bachelor of Business Technology and Livelihood Education major in Home Economics',
      abbreviation: 'BBTLEDHE',
    },
    {
      name: 'Bachelor of Business Technology and Livelihood Education major in Information Communication and Technology',
      abbreviation: 'BTLEDICT',
    },
    {
      name: 'Bachelor of Science in Business Administration major in Human Resource Management',
      abbreviation: 'BSBAHRM',
    },
    {
      name: 'Bachelor of Science in Business Administration major in Marketing Management',
      abbreviation: 'BSBA-MM',
    },
    {
      name: 'Bachelor of Science in Entrepreneurship',
      abbreviation: 'BSENTREP',
    },
    {
      name: 'Bachelor of Public Administration with specialization in Fiscal Administration',
      abbreviation: 'BPAFA',
    },
    {
      name: 'Diploma in Office Management Technology Medical Office Management',
      abbreviation: 'DOMTMOM',
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { abbreviation: program.abbreviation },
      update: {},
      create: program,
    });
  }


  // Seed users
  const users = [
    // Admin user
    {
      walletAddress: '0xD235278d4EBf728E5693aCcB1D9902DCDb4dCf8a',
      role: 'admin',
      email: 'registrar@pup.edu.ph',
    },

  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { walletAddress: user.walletAddress },
      update: {},
      create: user,
    });
  }
}

main()
  .then(() => {
    console.log('Seed complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
