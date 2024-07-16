import { useStorage } from '#imports';
import { storageClient } from '@/storage/core/s3Driver';
import { StorageDriver } from '@/types/enums/StorageDriver';
import { GetObjectCommand, type GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const useImages = () => {
    const storage = useStorage(StorageDriver.S3);

    if (!storage) {
        throw createError({ statusCode: 500, statusMessage: 'storage not found' });
    }

    if (!storageClient) {
        throw createError({ statusCode: 500, statusMessage: 'storage client not found' });
    }

    const getItemPath = async (key: string) => {
        const [bucket, ..._keyParts] = key.split(/:/);
        const _key = _keyParts.join('/');

        const input: GetObjectCommandInput = {
            Bucket: bucket,
            Key: _key,
        };
        const command = new GetObjectCommand(input);
        const signedUrl = await getSignedUrl(storageClient, command, { expiresIn: 3600,  });

        return signedUrl;
    };

    return {
        getItemPath,
        getItem: storage.getItem,
    };
};

export default useImages;