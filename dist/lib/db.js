import { PrismaClient } from '../src/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const prismaClientSingleton = () => {
    return new PrismaClient({
        adapter
    });
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;
export { prisma };
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}
