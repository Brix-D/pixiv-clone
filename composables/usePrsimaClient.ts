import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient;

export const usePrismaClient = () => {

    if (process.client) {
        throw createError({ statusCode: 500, statusMessage: 'unable to get database contection from client side' });
    }

    if (!prismaClient) {
        prismaClient = new PrismaClient();
    }

    return prismaClient;
}

export default usePrismaClient;