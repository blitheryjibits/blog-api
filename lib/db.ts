import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Prisma } from '../prisma/generated/client.js';

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })

const prismaClientSingleton = () => {
    return new PrismaClient({
        adapter
    });
} 

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export { prisma, Prisma };
if (process.env.NODE_ENV !== 'production') { globalThis.prismaGlobal = prisma; }