import { PrismaClient } from '@prisma/client';
import { getToken } from '#auth';
import { useFileAssets } from '@/server/utils/useFileAssets';
import { FileAssetsPayload } from '@/types/fileAssets';


const parseFormDataNestedFiles = (bodyFormData: FormData): FileAssetsPayload['create'] => {
    
    const _payload: FileAssetsPayload['create'] = [];
    const patternKey = new RegExp(/^create\[(\d+)\]\[file\]$/);

    for (const [key, value] of bodyFormData.entries()) {

        const isFile = patternKey.test(key);

        if (!isFile) {
            console.log('skip', key);
            continue;
        }

        _payload.push({
            file: value as File,
        });
    }

    return _payload;
}


export default defineEventHandler(async (event) => {
    const bodyFormData = await readFormData(event);

    if (!bodyFormData) {
        throw createError({
            status: 422,
            statusCode: 422,
            message: 'empty body',
        });
    }

    const prisma = new PrismaClient();

    const token = await getToken({ event });

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

    const defaultAlbum = await prisma.album.findFirst({
        where: {
            userId: currentUser.id,
        },
    });

    if (!defaultAlbum) {
        throw createError({
            status: 422,
            statusCode: 422,
            message: 'default album not found',
        });
    }

    const newImage = await prisma.image.create({
        data: { albumId: defaultAlbum.id, isNsfw: !!bodyFormData.get('nsfw') },
    });

    let syncPayload: FileAssetsPayload = {
        create: parseFormDataNestedFiles(bodyFormData),
        delete: bodyFormData.getAll('delete[]') as FileAssetsPayload['delete'],
    };

    console.log(syncPayload);

    const { sync } = await useFileAssets(newImage);

    await sync({ ...syncPayload });

    setResponseStatus(event, 201);

    return {};
});