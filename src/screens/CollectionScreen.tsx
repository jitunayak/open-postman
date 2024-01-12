import React from "react";
import styled from "styled-components";
import { CollectionSidebar } from "../components/CollectionsSidebar";
import { Playground } from "../components/Playground";
import { useStore } from "../store/useStore";
import {
  ICollectionList,
  ICollectionRequest,
} from "../types/ICollectionRequest";
import { ScrollArea } from "@mantine/core";

export const CollectionScreen: React.FC = ({}) => {
  const { collections, setCollections, selectedRequest, setSelectRequest } =
    useStore();

  const handleRequestChange = (item: ICollectionRequest) => {
    setSelectRequest(item);
  };

  const saveRequest = (item: ICollectionRequest) => {
    const collection = collections.find((c) => c.id === item.parentId);
    if (!collection) {
      throw new Error("Collection invalid");
    }
    const update: ICollectionList[] = [
      ...collections.filter((collection) => collection.id !== item.parentId),
      {
        ...collection,
        requests: [
          ...collection.requests.filter((rq) => rq.id !== item.id),
          item,
        ],
      },
    ];
    setCollections(update);
  };
  return (
    <>
      <ScrollArea h={"100vh"}>
        <CollectionSidebar
          collections={collections}
          handleRequestChange={handleRequestChange}
        />
      </ScrollArea>

      {selectedRequest && (
        <PlaygroundContainer>
          <Playground saveRequest={saveRequest} request={selectedRequest} />
        </PlaygroundContainer>
      )}
    </>
  );
};

const PlaygroundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding-top: 1rem;
`;
