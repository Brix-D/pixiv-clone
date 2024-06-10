import { createStorage } from "unstorage";
import fsDriver from 'unstorage/drivers/fs';
import {
    S3Client,
    HeadObjectCommand,
    type HeadObjectCommandInput,
    NotFound,
    GetObjectCommand,
    type GetObjectCommandInput,
    PutObjectCommand,
    type PutObjectCommandInput,
    DeleteObjectCommand,
    type DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import { StorageDriver } from '@/types/enums/StorageDriver';


const createConnectionFs = () => {
    return createStorage({
        driver: fsDriver({ base: '../files', }),
    });
}

const createConnectionS3 = () => {
    return new S3Client({
        credentials: {
            accessKeyId: '',
            secretAccessKey: '',
        },
        region: '',
    });
}

const createStorageConnection = (driver: StorageDriver) => {
    let storageClient;

    switch (driver) {
        case StorageDriver.FS:
            storageClient = createConnectionFs();
            break;
        case StorageDriver.S3:
            storageClient = createConnectionS3();
            break;
        default:
            throw createError({ message: 'incorrect driver' });
    }

    return storageClient;
}

const selectStorageDriver = (driver: StorageDriver | null = null) => {
    const config = useRuntimeConfig();

    const driverDefault = config.public.storageDriverDefault as StorageDriver;

    let _driver = driver;
    if (!_driver) {
        _driver = driverDefault;
    }

    return _driver;
}

const getS3Methods = (connection: S3Client) => {
    const hasItem = async (key: string, bucket: string) => {
        const input: HeadObjectCommandInput = {
            Bucket: bucket,
            Key: key,
        };

        const command = new HeadObjectCommand(input);
        try {
            const data = await connection.send(command);

            return true;
        } catch (error: unknown) {
            return false;
        }
    }

    const getItem = async (key: string, bucket: string) => {
        
        const input: GetObjectCommandInput = {
            Bucket: bucket,
            Key: key,
        };
        const command = new GetObjectCommand(input);
        try {
            const data = await connection.send(command);
            const body = data.Body;

            if (!body) {
                throw Error('got empty body');
            }

            const byteArray = await body.transformToByteArray();
            const file = new Blob([byteArray.buffer], { type: 'application/octet-stream' })
            return file;

        } catch (error: unknown) {
            throw error;
        }
    }
    
    const setItem = async (key: string, value: any, bucket: string) => {
        const input: PutObjectCommandInput = {
            Bucket: bucket,
            Key: key,
            Body: value,
        };
        const command = new PutObjectCommand(input);
        try {
            const data = await connection.send(command);
        } catch (error: unknown) {
            throw error;
        }
    }

    const removeItem = async (key: string, bucket: string) => {
        const input: DeleteObjectCommandInput = {
            Bucket: bucket,
            Key: key,
        };
        const command = new DeleteObjectCommand(input);
        try {
            const data = await connection.send(command);
        } catch (error: unknown) {
            throw error;
        }
    }

    return {
        hasItem,
        getItem,
        setItem,
        removeItem,
    };
};

const getStorageMethods = (driver: StorageDriver, connection: ReturnType<typeof createStorageConnection>) => {

    let methods = {};

    switch (driver) {
        case StorageDriver.FS:
            methods = { ...connection };
            break;
        case StorageDriver.S3:
            if (connection instanceof S3Client) {
                methods = getS3Methods(connection);
            }
            break;
        default:
            throw createError({ message: 'unable to get storage methods' });
    }

    return methods;
};

let storageClients: Record<StorageDriver[number], ReturnType<typeof createStorageConnection>> = {};

export const useStorage = (driver: StorageDriver | null = null) => {

    const _driver = selectStorageDriver(driver);

    if (!storageClients[_driver]) {
        storageClients[_driver] = createStorageConnection(_driver);
    }

    let storageMethods: Record<string, Function> = getStorageMethods(_driver, storageClients[_driver]);

    return {
        ...storageMethods,
    };
};


