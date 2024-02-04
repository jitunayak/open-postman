export enum AuthenticationTypes {
  No_Auth = "No Authentication",
  AWS_Signature = "AWS Signature",
  Inherit = "Inherit",
}

type AWSAccessType = {
  name: AuthenticationTypes.AWS_Signature;
} & {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};
type NoAuthType = {
  name: AuthenticationTypes.No_Auth;
};

type InheritType = {
  name: AuthenticationTypes.Inherit;
};

type AuthenticationDetails = AWSAccessType | NoAuthType;

export interface ICollectionRequest {
  id: string;
  parentId: string;
  label: string;
  url: string;
  method: string;
  bodyPayload: string;
  authorization: AuthenticationTypes;
  authorizationDetails: AuthenticationDetails | InheritType;
  headers: Array<{ key: string; value: string; isActive: boolean }>;
}

export interface ICollectionList {
  id: string;
  collectionName: string;
  requests: ICollectionRequest[];
  authorization?: AuthenticationTypes;
  authorizationDetails?: AuthenticationDetails;
}
