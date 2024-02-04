import {
  Badge,
  Button,
  DEFAULT_THEME,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Stack,
} from "@mantine/core";
import {
  IconHttpDelete,
  IconHttpGet,
  IconHttpPatch,
  IconHttpPost,
  IconHttpPut,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { JSONTree } from "react-json-tree";

import { useStore } from "../store/useStore";

export const HistoryScreen = () => {
  const { consoleLogs } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [consoleLogs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  const theme = {
    scheme: "custom",
    author: "Jitu Nayak",
    base00: DEFAULT_THEME.colors.dark[7],
    base01: "#383830",
    base02: "#49483e",
    base03: "#75715e",
    base04: "#a59f85",
    base05: "#f8f8f2",
    base06: "#f5f4f1",
    base07: "#f9f8f5",
    base08: "#f0518c",
    base09: "#fd971f",
    base0A: "#f4bf75",
    base0B: "#92b153",
    base0C: "#aeaeae",
    base0D: "#8dbcc7",
    base0E: "#ae81ff",
    base0F: "#cc6633",
  };

  const scrollDown = () =>
    scrollRef.current
      ? scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      : null;

  const scrollUp = () => {
    scrollRef.current
      ? scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      : null;
  };
  return (
    <Stack w="100%" p={"lg"} h={"100vh"}>
      <Group>
        <Button variant="subtle " onClick={() => scrollDown()}>
          Scroll End
        </Button>
        <Button variant="subtle" onClick={() => scrollUp()}>
          Scroll Top
        </Button>
      </Group>
      <ScrollArea h={800} pb={"lg"}>
        <Stack ref={scrollRef}>
          {consoleLogs
            .filter((l) => l.type == "request")
            .map((log, index) => (
              <NavLink
                key={index}
                label={log.data}
                // color={`${getRequestMethodColor(
                //   log.data.match(/(?<=-X\s)\w+/)?.at(0) ?? "GET"
                // )}`}
                // variant="filled"
                // active
                icon={(() => {
                  switch (log.data.match(/(?<=-X\s)\w+/)?.at(0) ?? "GET") {
                    case "GET":
                      return <IconHttpGet size={20} color="green" />;
                    case "POST":
                      return <IconHttpPost size={20} color="orange" />;
                    case "PUT":
                      return <IconHttpPut size={20} color="yellow" />;
                    case "DELETE":
                      return <IconHttpDelete size={20} color="red" />;
                    case "PATCH":
                      return <IconHttpPatch size={20} color="purple" />;
                    default:
                      return <IconHttpGet size={20} />;
                  }
                })()}
              >
                <Badge size={"md"} variant="light" mb={"sm"}>
                  {new Date(log.timeStamp as string).toLocaleString()}
                </Badge>

                <JSONTree
                  data={consoleLogs[index * 2 + 1]?.data}
                  theme={theme}
                />
                <Divider w={"100%"} mt={"md"} />
              </NavLink>
            ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};
