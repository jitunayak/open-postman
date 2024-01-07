import React from "react";
import styled from "styled-components";
import { CollectionSidebar } from "../components/CollectionsSidebar";
import { Playground } from "../components/Playground";
import { useStore } from "../store/useStore";
import { ICollectionRequest } from "../types/ICollectionRequest";

export const CollectionScreen: React.FC = ({}) => {
  const { collections, selectedRequest, setSelectRequest } = useStore();

  const handleRequestChange = (item: ICollectionRequest) => {
    setSelectRequest(item);
  };

  return (
    <>
      <CollectionSidebar
        collections={collections}
        handleRequestChange={handleRequestChange}
      />

      {selectedRequest && (
        <PlaygroundContainer>
          <Playground
            initialBodyPayload={selectedRequest.bodyPayload}
            initialMethodType={selectedRequest.method}
            initialUrl={selectedRequest.url}
            initialRequestName={selectedRequest.label}
          />
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
  width: 100%;
  padding-left: 16rem;
  padding-right: 1rem;
  padding-top: 1rem;
`;
