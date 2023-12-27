import { NavLink } from "@mantine/core";
import React from "react";
import styled from "styled-components";
import {
  ICollectionList,
  ICollectionRequest,
} from "../types/ICollectionRequest";

type IProps = {
  collections: ICollectionList[];
  handleRequestChange: (e: ICollectionRequest) => void;
};
export const CollectionSidebar: React.FC<IProps> = ({
  handleRequestChange,
  collections,
}) => {
  return (
    <SidebarContainer>
      {collections.map((collection) => (
        <NavLink
          label={collection.collectionName}
          childrenOffset={28}
          defaultOpened
        >
          {collection.requests.map((item) => (
            <NavLink
              label={`${item.label}`}
              onClick={() => handleRequestChange(item)}
            />
          ))}
        </NavLink>
      ))}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  position: fixed;
  left: 6rem;
`;
