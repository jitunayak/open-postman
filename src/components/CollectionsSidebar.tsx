import { DEFAULT_THEME, Text } from "@mantine/core";
import React, { memo } from "react";
import styled from "styled-components";
import { useStore } from "../store/useStore";
import {
  ICollectionList,
  ICollectionRequest,
} from "../types/ICollectionRequest";
import { getRequestMethodColor } from "../utils/RequestUtils";

type IProps = {
  collections: ICollectionList[];
  handleRequestChange: (e: ICollectionRequest) => void;
};
const CollectionSidebar1: React.FC<IProps> = ({
  handleRequestChange,
  collections,
}) => {
  const { selectedRequest, setSelectRequest } = useStore();
  return (
    <SidebarContainer>
      {collections.map((collection) => (
        <>
          <Text size={"sm"} fw={600} mt={"lg"}>
            {collection.collectionName}
          </Text>
          <div>
            {collection.requests.map((item) => (
              <Request
                $active={selectedRequest.id === item.id}
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
        // <NavLink
        //   label={collection.collectionName}
        //   childrenOffset={28}
        //   defaultOpened
        // >
        //   {collection.requests.map((item) => (
        //     <NavLink
        //       label={`${item.label}`}
        //       onClick={() => handleRequestChange(item)}
        //     />
        //   ))}
        // </NavLink>
      ))}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  position: fixed;
  left: 6rem;
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
    props.$active ? DEFAULT_THEME.colors.dark[4] : "transparent"};
  border-left: ${(props) =>
    `2px solid ${
      props.$active ? DEFAULT_THEME.colors.orange[6] : "transparent"
    }`};

  &:hover {
    background-color: ${(props) =>
      props.$active
        ? DEFAULT_THEME.colors.dark[4]
        : DEFAULT_THEME.colors.dark[6]};
  }
`;

export const CollectionSidebar = memo(CollectionSidebar1);
