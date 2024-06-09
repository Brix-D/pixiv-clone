import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';

const prisma = new PrismaClient();

interface IRegisterBody {
    name: string;
    email: string;
    password: string;
};

export default defineEventHandler(async (event) => {
    const { email, password, name } = await readBody<IRegisterBody>(event);

    if (!email || !name || !password) {
        throw createError({ statusCode: 422, message: 'incorrect data' });
    }

    const hashedPassword = await hash(password, 10);
    try {
    await prisma.user.create({
        data: { email, password: hashedPassword, name }
    });

    setResponseStatus(event, 201);
    return {};

    } catch (error: unknown) {
        console.log('create use Error', error);

        throw createError({ statusCode: 403, message: 'registration forbidden' });
    }
});