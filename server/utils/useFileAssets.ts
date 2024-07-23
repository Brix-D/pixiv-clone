import { useStorage } from '#imports';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { usePrismaClient } from '@/composables/usePrsimaClient';
import { FileAsset, ModelWithFileAsset } from '@prisma/client';
import { getItemUrl } from '@/server/utils/getItemUrl';
import { FileAssetsItemResponse, FileAssetsPayload } from '@/types/fileAssets';
import { StorageDriver } from '@/types/enums/StorageDriver';

interface ModelInput {
    id: string;
    fileAssets?: FileAsset[];
    [key: string]: any;
}

interface FilesTempData {
    file: File;
    name: string;
    modelType: ModelWithFileAsset;
    extension: string;
    mimeType: string,
    size: number;
    modelId: string;
}

export const useFileAssets = async (model: ModelInput, modelType: ModelWithFileAsset = ModelWithFileAsset.Image) => {
    const prisma = usePrismaClient();

    const config = useRuntimeConfig();

    const storage = useStorage(StorageDriver.S3);

    const _generateFileNameRandom = () => {
        return crypto.randomBytes(40).toString('hex');
    };

    const _getFileDirectory = (filename: string) => {
        return `${filename.substring(0, 2)}/${filename.substring(2, 4)}`;
    };

    const { setItem, removeItem, hasItem } = storage;

    const _handleCreate = async (files: FileAssetsPayload['create'] = []) => {

        const filesTemp: FilesTempData[] = [];

        for (let [index, fileToCreate] of files.entries()) {
            const fileOriginal = fileToCreate.file;

            const mimeType = fileOriginal.type;
            let extension = mimeType.split('/')[1];

            if (extension === 'jpeg') {
                extension = 'jpg';
            }

            const fileName = _generateFileNameRandom();
            const fileNameWithDir = _getFileDirectory(fileName);

            filesTemp.push({
                file: fileOriginal,
                name: `${fileNameWithDir}/${fileName}`,
                extension: extension,
                mimeType: mimeType,
                size: fileOriginal.size,
                modelType: modelType,
                modelId: model.id,
            });
        }


        const filePromises = [];

        for (let [index, fileTemp] of filesTemp.entries()) {
            const buffer = Buffer.from(await fileTemp.file.arrayBuffer());
            const base64File = buffer.toString('base64');
            const promiseStorage = setItem(`${config.storageS3Bucket}:${fileTemp.name}.${fileTemp.extension}`, base64File, { contentType: fileTemp.mimeType });

            const promiseQuery = prisma.$transaction([
                prisma.fileAsset.create({
                    data: {
                        name: fileTemp.name,
                        extension: fileTemp.extension,
                        mimeType: fileTemp.mimeType,
                        size: fileTemp.size,
                        modelType: fileTemp.modelType,
                        modelId: fileTemp.modelId
                    },
                })
            ]);

            const filePromise = new Promise<FileAsset>(async (resolve, reject) => {
                try {
                    await promiseStorage;
                    const fileInDatabase = await promiseQuery;
                    resolve(fileInDatabase[0]);
                } catch (error: unknown) {
                    const isExists = await hasItem(`${config.storageS3Bucket}:${fileTemp.name}.${fileTemp.extension}`);
                    if (isExists) {
                        await removeItem(`${config.storageS3Bucket}:${fileTemp.name}.${fileTemp.extension}`);
                    }

                    console.log('create FileAsset error', error);
                    reject(error);
                }
            });

            filePromises.push(filePromise);
        }



        const filesTransactions = await Promise.allSettled(filePromises);

        const filesUploadsSuccess = filesTransactions.map((fileTransaction) => fileTransaction.status === 'fulfilled').length;
        const filesUploadsFailed = filesTransactions.map((fileTransaction) => fileTransaction.status === 'rejected').length;

        return { success: filesUploadsSuccess, failed: filesUploadsFailed };
    };
    const _handleDelete = async (fileIds: FileAssetsPayload['delete'] = []) => {

        for (let fileId of fileIds) {
            const file = await prisma.fileAsset.findFirst({
                where: {
                    id: fileId,
                },
            });

            if (!file) {
                continue;
            }

            try {
                const isExists = await hasItem(`${config.storageS3Bucket}:${file.name}.${file.extension}`);
                if (isExists) {
                    await removeItem(`${config.storageS3Bucket}:${file.name}.${file.extension}`);
                    await prisma.fileAsset.delete({
                        where: {
                            id: file.id,
                        },
                    });
                } else {
                    console.log('not deleted', `${config.storageS3Bucket}:${file.name}.${file.extension}`);
                }
              
            } catch (error: unknown) {
                console.log('delete FileAsset error', error);
            }
        }
    };

    const getAll = async () => {
        let fileAssets: FileAsset[] = [];
        if (model.fileAssets && !!model.fileAssets.length) {
            fileAssets = [...model.fileAssets];
        } else {
            fileAssets = await prisma.fileAsset.findMany({
                where: {
                    id: model.id,
                },
            });
        }

        const fileAssetsFormat: FileAssetsItemResponse[] = [];

        for (let fileAsset of fileAssets) {
            fileAssetsFormat.push({
                fileAsset: await getItemUrl(`${config.storageS3Bucket}:${fileAsset.name}.${fileAsset.extension}`),
            });
        }

        return fileAssetsFormat;
    };

    const sync = async (payload: FileAssetsPayload) => {
        const filesToCreate = payload.create ?? [];
        const filesToDelete = payload.delete ?? [];

        // filesToCreate
        await _handleCreate(filesToCreate);
        // filesToDelete
        await _handleDelete(filesToDelete);
    };

    return {
        getAll,
        sync,
    };
}

export default useFileAssets;