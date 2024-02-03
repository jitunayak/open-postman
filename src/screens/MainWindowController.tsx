import { Button, DEFAULT_THEME, Divider, Text } from "@mantine/core";
import {
  IconBookmark,
  IconHistory,
  IconSettings,
  IconVersions,
} from "@tabler/icons-react";
import React, { ReactElement, memo, useState } from "react";
import styled from "styled-components";
import { CollectionScreen } from "./CollectionScreen";
import { EnvironmentScreen } from "./EnvironmentScreen";
import { HistoryScreen } from "./HistoryScreen";

function TabItem(props: {
  tabSelectedIndex: number;
  setTabSelectedIndex: (arg0: number) => void;
  icon: ReactElement;
  label: string;
  id: number;
}) {
  return (
    <Tab
      $active={props.tabSelectedIndex === props.id}
      onClick={() => props.setTabSelectedIndex(props.id)}
    >
      {props.icon}
      <Text size={"xs"}>{props.label}</Text>
    </Tab>
  );
}

export const MainWindowController: React.FC = () => {
  const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

  return (
    <Container>
      <SideTab>
        <TabItem
          id={0}
          label="Collections"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconVersions size={20} stroke={1.6} />}
        ></TabItem>
        <TabItem
          id={1}
          label="Environment"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconBookmark size={20} stroke={1.6} />}
        ></TabItem>
        <TabItem
          id={2}
          label="History"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconHistory size={20} stroke={1.6} />}
        ></TabItem>
        <TabItem
          id={3}
          label="Settings"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconSettings size={20} stroke={1.6} />}
        ></TabItem>
      </SideTab>

      {tabSelectedIndex === 0 && <CollectionScreen />}
      {tabSelectedIndex === 1 && <EnvironmentScreen />}
      {tabSelectedIndex === 2 && <HistoryScreen />}
      {tabSelectedIndex === 3 && <Text>Settings Screen</Text>}
    </Container>
  );
};

const Container = styled.span`
  display: inline-flex;
  width: 100%;
`;

const SideTab = styled.div`
  height: 100vh;
  width: max-content;
  background-color: ${DEFAULT_THEME.colors.dark[8]};
`;
const Tab = styled.span<{ $active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  padding: 0.4rem;
  height: 4.2rem;
  width: 5rem;
  /* border-radius: ${DEFAULT_THEME.radius.xs}; */
  margin: 0.4rem;
  color: ${(props) =>
    props.$active
      ? DEFAULT_THEME.colors.dark[0]
      : DEFAULT_THEME.colors.dark[2]};
  background-color: ${(props) =>
    props.$active ? DEFAULT_THEME.colors.dark[7] : "transparent"};
  border-left: ${(props) =>
    props.$active
      ? `2px solid ${DEFAULT_THEME.colors.orange[6]}`
      : "2px solid transparent"};
`;
