import { ActionIcon, DEFAULT_THEME, Group, Space, Text } from "@mantine/core";
import React from "react";
import styled from "styled-components";
import { useStore } from "../store/useStore";
import {
  AuthenticationTypes,
  ICollectionList,
  ICollectionRequest,
} from "../types/ICollectionRequest";
import { getRequestMethodColor } from "../utils/RequestUtils";
import { useHotkeys } from "@mantine/hooks";

type IProps = {
  collections: ICollectionList[];
  handleRequestChange: (e: ICollectionRequest) => void;
};
export const CollectionSidebar: React.FC<IProps> = ({
  handleRequestChange,
  collections,
}) => {
  const { selectedRequest, setSelectRequest, setCollections } = useStore();
  const addNewRequest = (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    const id = (Math.random().toString(36) + "000000000000000000000").slice(
      2,
      16
    );
    const newRequest: ICollectionRequest = {
      id,
      bodyPayload: "",
      label: "New Request" + id,
      method: "GET",
      parentId: collectionId,
      url: "",
      authorization: AuthenticationTypes.Inherit,
      authorizationDetails: {
        name: AuthenticationTypes.Inherit,
      },
    };
    const collectionIndex = collections.findIndex((c) => c.id === collectionId);
    setCollections(
      collections.map((obj, i) => {
        if (i === collectionIndex) {
          return {
            ...collection,
            requests: [...collection.requests, newRequest],
          };
        } else {
          return obj;
        }
      })
    );

    setSelectRequest(newRequest);
  };
  const duplicateRequest = (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection || !selectedRequest) {
      throw new Error("Collection or request not found");
    }
    const collectionIndex = collections.findIndex((c) => c.id === collectionId);
    const id = (Math.random().toString(36) + "000000000000000000000").slice(
      2,
      16
    );
    const newCollections = collections.map((obj, i) => {
      if (i === collectionIndex) {
        return {
          ...collection,
          requests: collection.requests
            .slice(
              0,
              collection.requests.findIndex(
                (r) => r.id === selectedRequest.id
              ) + 1
            )
            .concat({
              ...selectedRequest,
              label: selectedRequest.label + " copy",
              id,
            })
            .concat(
              collection.requests.slice(
                collection.requests.findIndex(
                  (r) => r.id === selectedRequest.id
                ) + 1
              )
            ),
        };
      } else {
        return obj;
      }
    });

    setCollections(newCollections);
    setSelectRequest({ ...selectedRequest, id });
  };

  useHotkeys([
    [
      "mod+d",
      () =>
        selectedRequest?.parentId
          ? duplicateRequest(selectedRequest.parentId)
          : null,
    ],
  ]);

  return (
    <SidebarContainer>
      {collections.map((collection) => (
        <>
          <Group align="center">
            <ActionIcon
              variant="subtle"
              size="xs"
              onClick={() => addNewRequest(collection.id)}
            >
              +
            </ActionIcon>
            <Text size={"sm"} fw={600} my={"lg"} style={{ cursor: "pointer" }}>
              {collection.collectionName}
            </Text>
          </Group>

          <div>
            {collection.requests.map((item) => (
              <Request
                $active={selectedRequest?.id === item.id}
                onClick={() => {
                  setSelectRequest(item);
                  handleRequestChange(item);
                }}
              >
                <Text
                  style={{ fontSize: "10px" }}
                  color={getRequestMethodColor(item.method)}
                  w={"2rem"}
                  fw={600}
                  align="right"
                >
                  {item.method}
                </Text>
                <Text size={"sm"}>{item.label}</Text>
              </Request>
            ))}
          </div>
        </>
      ))}
      <Space h={100} />
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  height: 100vh;
  width: auto;
  overflow-y: scroll;
  background-color: ${DEFAULT_THEME.colors.dark[7]};
  border-right: 1px solid ${DEFAULT_THEME.colors.dark[5]};
`;

const Request = styled.div<{ $active: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: start;
  padding: 0.4rem 1rem;
  align-items: center;
  align-content: center;
  gap: 0.6rem;
  background-color: ${(props) =>
    props.$active ? DEFAULT_THEME.colors.dark[5] : "transparent"};
  border-left: ${(props) =>
    `2px solid ${
      props.$active ? DEFAULT_THEME.colors.orange[7] : "transparent"
    }`};

  &:hover {
    background-color: ${(props) =>
      props.$active
        ? DEFAULT_THEME.colors.dark[5]
        : DEFAULT_THEME.colors.dark[6]};
  }
`;
