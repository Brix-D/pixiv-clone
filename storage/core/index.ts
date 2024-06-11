// import { createHmac, createSign } from 'node:crypto';

// import { createStorage, type Storage, type StorageValue } from "unstorage";
// import fsDriver from 'unstorage/drivers/fs';
// import httpDriver from 'unstorage/drivers/http';
// // import {
// //     S3Client,
// //     HeadObjectCommand,
// //     type HeadObjectCommandInput,
// //     NotFound,
// //     GetObjectCommand,
// //     type GetObjectCommandInput,
// //     PutObjectCommand,
// //     type PutObjectCommandInput,
// //     DeleteObjectCommand,
// //     type DeleteObjectCommandInput,
// // } from "@aws-sdk/client-s3";
// import { StorageDriver } from '@/types/enums/StorageDriver';

// const getCurrentDateFormat = () => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentMonthString = currentMonth.toString().padStart(2, '0');
//     const currentDay = currentDate.getDate();
//     const currentDayString = currentDay.toString().padStart(2, '0');
//     const currentDateString = `${currentDate.getFullYear()}${currentMonthString}${currentDayString}`;
//     return currentDateString;
// };

// const sign = (secret: string, data: string): string => {
//     const hmac = createHmac('sha256', secret);
//     hmac.update(data);
//     const encoded = hmac.digest('hex');

//     return encoded;
// }

// const getAuthHeader = (): string => {
//     const config = useRuntimeConfig();

//     const currentDate = getCurrentDateFormat();
//     const dateKey = sign('AWS4' + config.storageS3AccessSecret, currentDate);

//     console.log('dateKey', dateKey);

//     const regionKey = sign(dateKey, "ru-central1");

//     console.log('regionKey', regionKey);

//     const serviceKey = sign(regionKey, "s3");

//     console.log('serviceKey', serviceKey);

//     const signingKey = sign(serviceKey, "aws4_request");

//     console.log('signingKey', signingKey);



//     return '';
// };

// const getHeaders = (): Record<string, string> => {
//     const _headers: Record<string, string> = {
//         'Authorization': ,
//     };

//     return _headers;
// }

// const createConnectionFs = () => {
//     return createStorage({
//         driver: fsDriver({ base: '../files', }),
//     });
// }

// const createConnectionS3 = () => {
//     // return new S3Client({
//     //     credentials: {
//     //         accessKeyId: '',
//     //         secretAccessKey: '',
//     //     },
//     //     region: '',
//     // });

//     return createStorage({
//         driver: httpDriver({ base: 'https://storage.yandexcloud.net/',
//             headers: getHeaders(),
//         }),
//     });
// }

// const createStorageConnection = (driver: StorageDriver) => {
//     let storageClient;

//     switch (driver) {
//         case StorageDriver.FS:
//             storageClient = createConnectionFs();
//             break;
//         case StorageDriver.S3:
//             storageClient = createConnectionS3();
//             break;
//         default:
//             throw createError({ message: 'incorrect driver' });
//     }

//     return storageClient;
// }

// const selectStorageDriver = (driver: StorageDriver | null = null) => {
//     const config = useRuntimeConfig();

//     const driverDefault = config.public.storageDriverDefault as StorageDriver;

//     let _driver = driver;
//     if (!_driver) {
//         _driver = driverDefault;
//     }

//     return _driver;
// }


// // const getS3Methods = (connection: S3Client) => {
// //     const hasItem = async (key: string, bucket: string) => {
// //         const input: HeadObjectCommandInput = {
// //             Bucket: bucket,
// //             Key: key,
// //         };

// //         const command = new HeadObjectCommand(input);
// //         try {
// //             const data = await connection.send(command);

// //             return true;
// //         } catch (error: unknown) {
// //             return false;
// //         }
// //     }

// //     const getItem = async (key: string, bucket: string) => {
        
// //         const input: GetObjectCommandInput = {
// //             Bucket: bucket,
// //             Key: key,
// //         };
// //         const command = new GetObjectCommand(input);
// //         try {
// //             const data = await connection.send(command);
// //             const body = data.Body;

// //             if (!body) {
// //                 throw Error('got empty body');
// //             }

// //             const byteArray = await body.transformToByteArray();
// //             const file = new Blob([byteArray.buffer], { type: 'application/octet-stream' })
// //             return file;

// //         } catch (error: unknown) {
// //             throw error;
// //         }
// //     }
    
// //     const setItem = async (key: string, value: any, bucket: string) => {
// //         const input: PutObjectCommandInput = {
// //             Bucket: bucket,
// //             Key: key,
// //             Body: value,
// //         };
// //         const command = new PutObjectCommand(input);
// //         try {
// //             const data = await connection.send(command);
// //         } catch (error: unknown) {
// //             throw error;
// //         }
// //     }

// //     const removeItem = async (key: string, bucket: string) => {
// //         const input: DeleteObjectCommandInput = {
// //             Bucket: bucket,
// //             Key: key,
// //         };
// //         const command = new DeleteObjectCommand(input);
// //         try {
// //             const data = await connection.send(command);
// //         } catch (error: unknown) {
// //             throw error;
// //         }
// //     }

// //     return {
// //         hasItem,
// //         getItem,
// //         setItem,
// //         removeItem,
// //     };
// // };

// // const getStorageMethods = (driver: StorageDriver, connection: ReturnType<typeof createStorageConnection>) => {

// //     let methods = {};

// //     switch (driver) {
// //         case StorageDriver.FS:
// //             methods = { ...connection };
// //             break;
// //         case StorageDriver.S3:
// //             if (connection instanceof S3Client) {
// //                 methods = getS3Methods(connection);
// //             }
// //             break;
// //         default:
// //             throw createError({ message: 'unable to get storage methods' });
// //     }

// //     return methods;
// // };

// let storageClients: Record<StorageDriver[number], ReturnType<typeof createStorageConnection>> = {};

// export const useStorage = (driver: StorageDriver | null = null) => {

//     const _driver = selectStorageDriver(driver);

//     if (!storageClients[_driver]) {
//         storageClients[_driver] = createStorageConnection(_driver);
//     }

//     // let storageMethods: Record<string, Function> = getStorageMethods(_driver, storageClients[_driver]);

// //     return {
// //         ...storageMethods,
// //     };


//     const currentDisk = ref('') as Ref<string>;

//     const setDisk = (disk: string) => {
//         currentDisk.value = disk;
//     };


//     const patchS3DriverConnection = (connection: Storage<StorageValue>) => {
//         const _connection = new Proxy(connection, {
//             get(target, p, receiver) {
//                 const property = p as keyof typeof target;
    
//                 type S3Functions = keyof Pick<typeof target, 'getItem' | 'hasItem' | 'setItem' | 'removeItem'>;
    
//                 const hasS3FunctionType = (property: unknown): property is S3Functions => {
//                     if (typeof property !== 'string') {
//                         return false;
//                     }
//                     return ['getItem', 'hasItem', 'setItem', 'removeItem'].includes(property);
//                 } 
    
//                 if (hasS3FunctionType(property)) {
    
    
//                     const originalFunction = target[property] as typeof target[S3Functions];
    
//                     const functionWithBucket = (key: string, ...args: any[]) => {
//                         const keyWithBucket = `${currentDisk.value}/${key}`;
//                         switch (property) {
//                             case 'getItem':
//                                 return target[property](keyWithBucket, ...args);
//                             case 'hasItem':
//                                 return target[property](keyWithBucket, ...args);
//                             case 'setItem':
//                                 return target[property](keyWithBucket, args[1], args[2]);
//                             case 'removeItem':
//                                 return target[property](keyWithBucket, ...args);
//                             default:
//                                 return target[property];
//                         }                        
//                     }
    
//                     return functionWithBucket(originalFunction.arguments);
//                 } else {
//                     return target[property];
//                 }
//             },
    
//         });
    
//         return _connection;
//     }

//     if (_driver === StorageDriver.S3) {
//         return patchS3DriverConnection(storageClients[_driver]);
//     }

//     return { storage: storageClients[_driver], setDisk };
// };




// import { createStorage } from 'unstorage';

// // import defineDriver from '@bg-dev/nuxt-s3/dist/runtime/server/utils/s3Driver';

// // @ts-ignore
// // import defineDriver from '@bg-dev/nuxt-s3/dist/runtime/server/utils/s3Driver';

// // import defineDriver from '#s3';
// import { s3Driver } from './s3Driver';
// // import {  } from '#imports';

// const config = useRuntimeConfig();
// export const storage = createStorage({
//     driver: s3Driver({
//         bucket: 'pinterest',
//         endpoint: 'https://storage.yandexcloud.net/',
//         region: 'ru-central1',
//         accessKeyId: config.storageS3AccessKey,
//         secretAccessKey: config.storageS3AccessSecret,
//     }),
// });

// export default storage;

// storage.mount(, 's3');