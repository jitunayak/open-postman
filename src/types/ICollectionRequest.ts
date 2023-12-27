export interface ICollectionRequest {
    id: string;
    label: string;
    url: string;
    method: string;
    bodyPayload: string;
}

export interface ICollectionList {
    collectionName: string;
    requests: ICollectionRequest[]
}