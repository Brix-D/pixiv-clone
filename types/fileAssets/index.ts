export interface FileAssetsItemResponse {
    fileAsset: string;
}

export interface FileAssetsPayloadItem {
    file: File;
}

export interface FileAssetsPayload {
    create?: FileAssetsPayloadItem[];
    delete?: string[];
}
