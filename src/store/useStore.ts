import { StoreApi, UseBoundStore, create } from "zustand";

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
export interface IStore {
  envs: IEnv[];
  setEnvs: (data: IEnv[]) => void;
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

export const useStore: UseBoundStore<StoreApi<IStore>> = create((set) => ({
  envs: initialEnv,
  setEnvs: (data: IEnv[]) => {
    set({ envs: data });
  },
}));
