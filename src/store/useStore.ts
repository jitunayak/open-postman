import { StoreApi, UseBoundStore, create } from "zustand";
import {
  AuthenticationTypes,
  ICollectionList,
  ICollectionRequest,
} from "../types/ICollectionRequest";

interface IEnv {
  id: string;
  label: string;
  list: {
    key: string;
    value: string;
    isChecked: boolean;
    type: "TEXT" | "SECRET";
  }[];
}
const initialEnv: IEnv[] = [
  {
    id: "1",
    label: "DEV",
    list: [
      {
        key: "BASE_URL",
        value: "https://jf5vveqi48.execute-api.us-east-1.amazonaws.com",
        isChecked: true,
        type: "TEXT",
      },
      {
        key: "ID",
        value: "1",
        isChecked: true,
        type: "TEXT",
      },
    ],
  },
  {
    id: "2",
    label: "UAT",
    list: [
      {
        key: "",
        value: "",
        isChecked: true,
        type: "TEXT",
      },
    ],
  },
];

const initialCollection: ICollectionList[] = [
  {
    id: "1a",
    collectionName: "My Test Collection",
    requests: [
      {
        id: "1",
        parentId: "1a",
        label: "get all quotes",
        url: "https://dev-quotes.deno.dev/api/v1/quotes",
        method: "GET",
        bodyPayload: "",
        authorization: AuthenticationTypes.No_Auth,
        authorizationDetails: {
          name: AuthenticationTypes.No_Auth,
        },
      },
      {
        id: "3",
        parentId: "1a",
        label: "create Todos",
        url: "https://jsonplaceholder.typicode.com/todos",
        method: "POST",
        authorization: AuthenticationTypes.No_Auth,
        authorizationDetails: {
          name: AuthenticationTypes.No_Auth,
        },
        bodyPayload: JSON.stringify(
          {
            userId: 10,
            id: 10,
            title: "Jitu is coming!",
            completed: false,
          },
          undefined,
          8
        ),
      },
      {
        id: "4",
        parentId: "1a",
        label: "get all Todos",
        url: "https://jsonplaceholder.typicode.com/todos",
        method: "GET",
        bodyPayload: "",
        authorization: AuthenticationTypes.No_Auth,
        authorizationDetails: {
          name: AuthenticationTypes.No_Auth,
        },
      },
    ],
  },
  {
    id: "1b",
    collectionName: "To Dos APIs",
    requests: [
      {
        id: "5",
        parentId: "1b",
        label: "create Todos",
        url: "https://jsonplaceholder.typicode.com/todos",
        method: "POST",
        authorization: AuthenticationTypes.No_Auth,
        authorizationDetails: {
          name: AuthenticationTypes.No_Auth,
        },
        bodyPayload: JSON.stringify(
          {
            userId: 10,
            id: 10,
            title: "Jitu is coming!",
            completed: false,
          },
          undefined,
          8
        ),
      },
      {
        id: "6",
        parentId: "1b",
        label: "api gateway testing",
        url: "https://jf5vveqi48.execute-api.us-east-1.amazonaws.com",
        method: "GET",
        bodyPayload: "",
        authorization: AuthenticationTypes.No_Auth,
        authorizationDetails: {
          name: AuthenticationTypes.No_Auth,
        },
      },
      {
        id: "7",
        parentId: "1b",
        label: "Variable Test",
        url: "{{BASE_URL}}/todo/{{ID}}",
        method: "GET",
        bodyPayload: "",
        authorization: AuthenticationTypes.AWS_Signature,
        authorizationDetails: {
          name: AuthenticationTypes.AWS_Signature,
          region: "us-east-1",
          accessKeyId: "access-key-123456789abcdef",
          secretAccessKey: "secret-access-key",
          sessionToken: "session-token",
        },
      },
    ],
  },
];
export interface IStore {
  envs: IEnv[];
  setEnvs: (data: IEnv[]) => void;
  collections: ICollectionList[];
  setCollections: (data: ICollectionList[]) => void;
  selectedRequest?: ICollectionRequest;
  setSelectRequest: (request: ICollectionRequest) => void;
  currentEnv: IEnv | undefined;
  setCurrentEnv: (env?: IEnv) => void;
}

export const useStore: UseBoundStore<StoreApi<IStore>> = create((set) => ({
  envs: initialEnv,
  setEnvs: (data: IEnv[]) => {
    set({ envs: data });
  },
  collections: initialCollection,
  setCollections: (data: ICollectionList[]) => {
    set({ collections: data });
  },
  selectedRequest: initialCollection[0].requests[0],
  setSelectRequest: (request: ICollectionRequest) => {
    set({ selectedRequest: request });
  },
  currentEnv: undefined,
  setCurrentEnv: (env?: IEnv) => {
    set({ currentEnv: env });
  },
}));
