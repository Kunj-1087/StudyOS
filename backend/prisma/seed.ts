import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Clean up existing data (optional, strict)
    // await prisma.subject.deleteMany();
    // await prisma.user.deleteMany();

    // 2. Create Deterministic User: Alice
    const aliceEmail = 'alice@example.com';
    const alicePassword = await bcrypt.hash('password123', 10);

    const alice = await prisma.user.upsert({
        where: { email: aliceEmail },
        update: {},
        create: {
            email: aliceEmail,
            name: 'Alice Student',
            password: alicePassword,
            subjects: {
                create: [
                    { name: 'Mathematics', color: '#FF5733' },
                    { name: 'Physics', color: '#33FF57' },
                    { name: 'History', color: '#3357FF' },
                ],
            },
        },
    });

    console.log(`✅ User created: ${alice.name} (${alice.email})`);

    // 3. Create Deterministic User: Bob
    const bobEmail = 'bob@example.com';
    const bobPassword = await bcrypt.hash('password123', 10);

    const bob = await prisma.user.upsert({
        where: { email: bobEmail },
        update: {},
        create: {
            email: bobEmail,
            name: 'Bob Scholar',
            password: bobPassword,
            subjects: {
                create: [
                    { name: 'Literature', color: '#F0F0F0' },
                    { name: 'Art', color: '#FF00FF' },
                ],
            },
        },
    });

    console.log(`✅ User created: ${bob.name} (${bob.email})`);

    console.log('🌱 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
