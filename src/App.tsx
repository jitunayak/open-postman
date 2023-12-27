import { MantineProvider } from "@mantine/core";
import styled from "styled-components";

import { useColorScheme } from "@mantine/hooks";
import "./App.css";
import { MainWindowController } from "./screens/MainWindowController";

function App() {
  const colorScheme = useColorScheme("dark");

  return (
    <MantineProvider theme={{ colorScheme, primaryColor: "orange" }}>
      <Container>
        <MainWindowController />
      </Container>
    </MantineProvider>
  );
}

export default App;

const Container = styled.div`
  justify-content: space-between;
  align-items: start;
  display: flex;
`;
