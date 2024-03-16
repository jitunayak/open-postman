import { DEFAULT_THEME, MantineProvider } from "@mantine/core";
import styled from "styled-components";

import "./App.css";
import { MainWindowController } from "./screens/MainWindowController";

function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        primaryColor: "orange",
        components: {
          TextInput: {
            styles: (theme) => ({
              input: {
                backgroundColor: theme.colors.dark[7],
                borderColor: theme.colors.dark[6],
              },
            }),
          },
          Textarea: {
            styles: (theme) => ({
              input: {
                backgroundColor: theme.colors.dark[7],
                borderColor: theme.colors.dark[6],
              },
            }),
          },
          Select: {
            styles: (theme) => ({
              input: { backgroundColor: theme.colors.dark[7] },
              dropdown: { backgroundColor: theme.colors.dark[7] },
            }),
          },
        },
      }}
    >
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
  /* background-color: rgb(43 42 43); */
  background-color: ${DEFAULT_THEME.colors.dark[7]};
  height: 100vh;
  width: 100%;
`;
