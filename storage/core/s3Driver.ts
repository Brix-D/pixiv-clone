import { defineDriver } from 'unstorage'

export interface S3DriverOptions {
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  region: string
  bucket?: string
  accountId?: string
}

import {
    S3Client,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsCommand,
    DeleteObjectsCommand,
    type GetObjectCommandInput,
    type HeadObjectCommandInput,
    type PutObjectCommandInput,
    type DeleteObjectCommandInput,
    type ListObjectsCommandInput,
    type DeleteObjectsCommandInput,
    type ObjectIdentifier,
} from '@aws-sdk/client-s3';
import { getSignedUrl, S3RequestPresigner } from '@aws-sdk/s3-request-presigner';

const DRIVER_NAME = 's3'

export default defineDriver((options: S3DriverOptions) => {
    const storageClient = new S3Client({
        credentials: {
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
        },
        endpoint: options.endpoint,
        region: options.region,
    });

    // const storageClientPresigner = new S3RequestPresigner({ ...storageClient.config });

    return {
        name: DRIVER_NAME,
        options,
        async getItem(key, opts) {
            const [bucket, ..._keyParts] = key.split(/:/);
            const _key = _keyParts.join('/');

            const input: GetObjectCommandInput = {
                Bucket: bucket,
                Key: _key,
            };
            const command = new GetObjectCommand(input);
            const signedUrl = await getSignedUrl(storageClient, command, { expiresIn: 3600,  });
            // const presignedCommand =  await storageClientPresigner.presign();
            // const data = await storageClient.send(command);
            // console.log('signedUrl', signedUrl);
            // const data = await $fetch<GetObjectCommandOutput>(signedUrl, {
            //     headers: {
                    
            //     }
            // });

            // const body = data.Body;
    
            // if (!body) {
            //     throw createError({ message: 'got empty body' });
            // }
    
            // const byteArray = await body.transformToByteArray();
            // const file = new Blob([byteArray.buffer], { type: 'application/octet-stream' })
            // return file;
            return signedUrl;
        },
        async hasItem(key, opts) {
            const [bucket, ..._keyParts] = key.split(/:/);
            const _key = _keyParts.join('/');

            const input: HeadObjectCommandInput = {
                Bucket: bucket,
                Key: _key,
            };
    
            const command = new HeadObjectCommand(input);
            try {
                const data = await storageClient.send(command);
                
                console.log('hasItem response', data);

                return true;
            } catch (error: unknown) {
                return false;
            }
        },
        async setItem(key, value, opts) {
            const [bucket, ..._keyParts] = key.split(/:/);
            const _key = _keyParts.join('/');

            const input: PutObjectCommandInput = {
                Bucket: bucket,
                Key: _key,
                Body: value,
            };
            const command = new PutObjectCommand(input);
            const data = await storageClient.send(command);

            console.log('setItem response', data);
        },
        async removeItem(key, opts) {
            const [bucket, ..._keyParts] = key.split(/:/);
            const _key = _keyParts.join('/');

            const input: DeleteObjectCommandInput = {
                Bucket: bucket,
                Key: _key,
            };
            const command = new DeleteObjectCommand(input);
            const data = await storageClient.send(command);

            console.log('removeItem response', data);
        },
        async getKeys(base, opts) {
            const bucket = base;

            const input: ListObjectsCommandInput = {
                Bucket: bucket,
            };

            const command = new ListObjectsCommand(input);
            const response = await storageClient.send(command);

            console.log('getKeys response', response);
            if (!response.Contents) {
               return [];
            }

            const keys = response.Contents.map((object) => {
                return object.Key as string;
            });

            return keys;
        },
        async clear(base, opts) {
            const bucket = base;

            const keys = await this.getKeys(base, opts);

            const objectsToDelete: ObjectIdentifier[] = keys.map((key) => {
                return {
                    Key: key,
                };
            });

            const input: DeleteObjectsCommandInput = {
                Bucket: bucket,
                Delete: {
                    Objects: objectsToDelete,
                },
            };

            const command = new DeleteObjectsCommand(input);
            const response = await storageClient.send(command);

            console.log('clear response', response);
        },
    };
});