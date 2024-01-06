import React, { useState } from "react";
import styled from "styled-components";
import { CollectionSidebar } from "../components/CollectionsSidebar";
import { Playground } from "../components/Playground";
import {
  ICollectionList,
  ICollectionRequest,
} from "../types/ICollectionRequest";

export const CollectionScreen: React.FC = ({}) => {
  const [collections] = useState<ICollectionList[]>([
    {
      collectionName: "My Test Collection",
      requests: [
        {
          id: "1",
          label: "get all quotes",
          url: "https://dev-quotes.deno.dev/api/v1/quotes",
          method: "GET",
          bodyPayload: "",
        },
        {
          id: "3",
          label: "create Todos",
          url: "https://jsonplaceholder.typicode.com/todos",
          method: "POST",
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
          id: "2",
          label: "get all Todos",
          url: "https://jsonplaceholder.typicode.com/todos",
          method: "GET",
          bodyPayload: "",
        },
      ],
    },
    {
      collectionName: "To Dos APIs",
      requests: [
        {
          id: "3",
          label: "create Todos",
          url: "https://jsonplaceholder.typicode.com/todos",
          method: "POST",
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
          id: "2",
          label: "api gateway testing",
          url: "https://jf5vveqi48.execute-api.us-east-1.amazonaws.com",
          method: "GET",
          bodyPayload: "",
        },
        {
          id: "3",
          label: "Variable Test",
          url: "{{BASE_URL}}/todo/{{ID}}",
          method: "GET",
          bodyPayload: "",
        },
      ],
    },
  ]);

  const [currentRequest, setCurrentRequest] = useState<ICollectionRequest>(
    collections[0].requests[0]
  );

  const handleRequestChange = (item: ICollectionRequest) => {
    setCurrentRequest(item);
  };

  return (
    <>
      <CollectionSidebar
        collections={collections}
        handleRequestChange={handleRequestChange}
      />

      {currentRequest && (
        <PlaygroundContainer>
          <Playground
            initialBodyPayload={currentRequest.bodyPayload}
            initialMethodType={currentRequest.method}
            initialUrl={currentRequest.url}
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
  padding-left: 14rem;
  padding-right: 1rem;
  padding-top: 1rem;
`;
