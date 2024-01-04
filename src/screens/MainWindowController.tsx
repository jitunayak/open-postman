import { DEFAULT_THEME, Text } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import {
  IconBookmark,
  IconHistory,
  IconSettings,
  IconVersions,
} from "@tabler/icons-react";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { CollectionTestingScreen } from "./CollectionTestingScreen";
import { EnvironmentScreen } from "./EnvironmentScreen";

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
          icon={<IconVersions size={25} stroke={1.6} />}
        ></TabItem>
        <TabItem
          id={1}
          label="Environment"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconBookmark size={25} stroke={1.6} />}
        ></TabItem>
        <TabItem
          id={2}
          label="History"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconHistory size={25} stroke={1.6} />}
        ></TabItem>
        <TabItem
          id={3}
          label="Settings"
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          icon={<IconSettings size={25} stroke={1.6} />}
        ></TabItem>
      </SideTab>
      {tabSelectedIndex === 0 && <CollectionTestingScreen />}
      {tabSelectedIndex === 1 && <EnvironmentScreen />}
      {tabSelectedIndex === 2 && <Text>History Screen</Text>}
      {tabSelectedIndex === 3 && <Text>Settings Screen</Text>}
    </Container>
  );
};

const Container = styled.span`
  display: inline-flex;
  width: 100%;
`;

const SideTab = styled.div`
  position: fixed;
`;
const Tab = styled.span<{ $active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  padding: 0.4rem;
  height: 4rem;
  width: 4rem;
  border-radius: 0.4rem;
  color: ${(props) =>
    props.$active
      ? useColorScheme() === "dark"
        ? DEFAULT_THEME.colors.dark[0]
        : DEFAULT_THEME.colors.dark[6]
      : DEFAULT_THEME.colors.dark[2]};
  background-color: ${(props) =>
    props.$active
      ? useColorScheme() === "dark"
        ? DEFAULT_THEME.colors.dark[6]
        : "#eee"
      : "transparent"};
`;
