import { useStore } from "../store/useStore";
import {
  Badge,
  Button,
  Container,
  Divider,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { getRequestMethodColor } from "../utils/RequestUtils";

export const HistoryScreen = () => {
  const { consoleLogs } = useStore();

  return (
    <Container>
      <ScrollArea h={800}>
        <Stack>
          {consoleLogs.map((log, index) => (
            <div key={index}>
              <Badge size={"md"} variant="light" mb={"sm"}>
                {new Date(log.timeStamp as string).toLocaleString()}
              </Badge>
              {log.type === "request" && (
                <Text
                  color={`${getRequestMethodColor(
                    log.data.match(/(?<=-X\s)\w+/)?.at(0) ?? "GET"
                  )}.2`}
                >
                  {log.data}
                </Text>
              )}
              {log.type === "response" && (
                <Text color="dimmed">{log.data}</Text>
              )}
              <Divider w={"100%"} mt={"md"} />
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Container>
  );
};
