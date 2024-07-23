import { type H3Event, type EventHandlerRequest } from 'h3';
import { usePrismaClient } from '@/composables/usePrsimaClient';
import { getToken } from '#auth';


export const getCurrentUser = async (event: H3Event<EventHandlerRequest>) => {
    const token = await getToken({ event });
    const prisma = usePrismaClient();

    if (!token || token && !token.sub) {
        throw createError({
            status: 401,
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const currentUser = await prisma.user.findFirst({
        where: {
            id: token.sub,
        },
    });

    if (!currentUser) {
        throw createError({
            status: 401,
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    return currentUser;
}

export default getCurrentUser;