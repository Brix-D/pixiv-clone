import { storageClient } from '@/storage/core/s3Driver';
import { GetObjectCommand, type GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// export const useS3Url = () => {
    // const storage = useStorage(StorageDriver.S3);

    // if (!storage) {
    //     throw createError({ statusCode: 500, statusMessage: 'storage not found' });
    // }

  

const getItemUrl = async (key: string) => {
    if (!storageClient) {
        throw createError({ statusCode: 500, statusMessage: 'storage client not found' });
    }

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

    // return {
    //     getItemUrl,
    //     // getItem: storage.getItem,
    // };
// };

export { getItemUrl };
export default getItemUrl;