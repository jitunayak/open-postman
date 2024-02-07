import { ScrollArea } from "@mantine/core";
import React from "react";
import styled from "styled-components";

import { CollectionSidebar } from "../components/CollectionsSidebar";
import { Playground } from "../components/Playground";
import { useStore } from "../store/useStore";
import { ICollectionRequest } from "../types/ICollectionRequest";

export const CollectionScreen: React.FC = ({}) => {
  const { collections, setCollections, selectedRequest, setSelectRequest } =
    useStore();

  const handleRequestChange = (item: ICollectionRequest) => {
    setSelectRequest(item);
  };

  const saveRequest = (item: ICollectionRequest) => {
    const collectionIndex = collections.findIndex(
      (c) => c.id === item.parentId
    );
    const requestIndex = collections[collectionIndex].requests.findIndex(
      (c) => c.id === item.id
    );

    const updatedCollectionRequests = collections[collectionIndex].requests;
    updatedCollectionRequests[requestIndex] = item;

    setCollections(
      collections.map((obj, i) => {
        if (i === collectionIndex) {
          return {
            ...collections[collectionIndex],
            requests: updatedCollectionRequests,
          };
        } else {
          return obj;
        }
      })
    );
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
