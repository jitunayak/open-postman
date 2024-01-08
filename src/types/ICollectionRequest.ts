export interface ICollectionRequest {
    id: string;
    parentId: string;
    label: string;
    url: string;
    method: string;
    bodyPayload: string;
}

export interface ICollectionList {
    id:string;
    collectionName: string;
    requests: ICollectionRequest[]
}