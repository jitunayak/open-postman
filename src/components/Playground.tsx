import {
  Autocomplete,
  Button,
  Grid,
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSend2 } from "@tabler/icons-react";
import aws4Interceptor from "aws4-axios";
import axios, { AxiosError, AxiosResponse } from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// const AwsClient = require("aws4fetch");

type IProps = {
  initialUrl?: string;
  initialMethodType?: string;
  initialBodyPayload?: string;
};
export const Playground: React.FC<IProps> = ({
  initialUrl = "",
  initialBodyPayload = "",
  initialMethodType = "GET",
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [response, setResponse] = useState<AxiosResponse>();
  const [methodType, setMethodType] = useState(initialMethodType);
  const [bodyPayload, setBodyPayload] = useState(initialBodyPayload);
  const [authorization, setAuthorization] = useState("No Auth");
  const [axiosTimer, setAxiosTimer] = useState("");

  const awsForm = useForm({
    initialValues: {
      accessKeyId: "",
      secretAccessKey: "",
      sessionToken: "",
    },
  });
  const axiosTimerFunc = (startTime: number) => {
    let now = Date.now();
    let seconds = Math.floor((now - startTime) / 1000);
    let milliseconds = Math.floor((now - startTime) % 1000);
    setAxiosTimer(`${seconds}.${milliseconds} seconds`);
  };

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    setMethodType(initialMethodType);
  }, [initialMethodType]);

  useEffect(() => {
    setBodyPayload(initialBodyPayload);
  }, [initialBodyPayload]);

  const [urlHistory, setUrlHistory] = useState([
    "http://localhost:3000",
    "https://dev-quotes.deno.dev/api/v1/quotes",
    "https://jsonplaceholder.typicode.com/todos",
  ]);

  const env = [
    {
      key: "BASE_URL",
      value: "https://jsonplaceholder.typicode.com",
    },
  ];

  const getFinalUrlFromEnvironment = (url: string) => {
    env.forEach((env) => (url = url.replace(`{{${env.key}}}`, env.value)));
    return url;
  };

  const sendRequestHandler = async () => {
    let startTime = Date.now();
    const client = axios.create({ adapter: axiosTauriApiAdapter });

    const suggestions = new Set(urlHistory);
    suggestions.add(url);
    setUrlHistory([...suggestions]);
    const actualUrl = getFinalUrlFromEnvironment(url);

    if (authorization === "AWS Signature") {
      const { accessKeyId, secretAccessKey, sessionToken } = awsForm.values;
      const interceptor = aws4Interceptor({
        options: {},
        credentials: {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        },
      });

      axios.interceptors.request.use(interceptor);
    }

    try {
      switch (methodType) {
        case "GET": {
          const result = await client.get(actualUrl);
          setResponse(result);
          console.log(result);
          break;
        }
        case "POST": {
          const result = await client.post(actualUrl, bodyPayload);
          setResponse(result);
          console.log(result.data);
          break;
        }
      }
      axiosTimerFunc(startTime);
    } catch (err) {
      console.log(err);
      axiosTimerFunc(startTime);

      if (err instanceof AxiosError) {
        setResponse(err.response);
      }
    }
  };

  const getStatusColor = (code?: number) => {
    if (String(code).startsWith("2")) {
      return "green";
    }
    if (String(code).startsWith("4")) {
      return "red";
    }

    if (String(code).startsWith("5")) {
      return "orange";
    } else {
      return "yellow";
    }
  };

  return (
    <Container>
      <Stack>
        <Header>
          <Select
            size="sm"
            placeholder="METHOD"
            data={["GET", "POST", "PATCH", "DELETE"]}
            value={methodType}
            onChange={(e) => setMethodType(e ?? methodType)}
          />
          <Autocomplete
            w={"100%"}
            placeholder="http://localhost:3000/v1/api"
            autoComplete=""
            data={urlHistory}
            value={url}
            onChange={(e) => setUrl(e)}
          />
          <Button
            size="sm"
            rightIcon={<IconSend2 size={14} />}
            onClick={() => sendRequestHandler()}
          >
            Send
          </Button>
        </Header>
        <Tabs defaultValue="authorization" mt={"md"}>
          <Tabs.List>
            <Tabs.Tab value="authorization">Authorization</Tabs.Tab>
            <Tabs.Tab value="params">Params</Tabs.Tab>
            <Tabs.Tab value="headers">Headers</Tabs.Tab>
            <Tabs.Tab value="body">Body</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="authorization" pt="xs">
            <Grid grow>
              <Grid.Col span={2}>
                <Select
                  label="Authorization"
                  data={["Inherit", "No Auth", "AWS Signature"]}
                  ta={"start"}
                  defaultValue={"AWS Signature"}
                  value={authorization}
                  onChange={(e) => setAuthorization(e ?? "")}
                  w={"10rem"}
                  size="sm"
                />
              </Grid.Col>
              {authorization === "AWS Signature" && (
                <Grid.Col span={8}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Table verticalSpacing={"md"}>
                      <tr>
                        <td>
                          <Text size="sm" ta={"start"}>
                            Access Key
                          </Text>
                        </td>
                        <td>
                          <TextInput
                            placeholder="Access Key"
                            {...awsForm.getInputProps("accessKeyId")}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Text size="sm" ta={"start"}>
                            Secret Key
                          </Text>
                        </td>
                        <td>
                          <TextInput
                            placeholder="Secret Key"
                            {...awsForm.getInputProps("secretAccessKey")}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Text size="sm" ta={"start"}>
                            Session Token
                          </Text>
                        </td>
                        <td>
                          <Textarea
                            placeholder="Session Token"
                            {...awsForm.getInputProps("sessionToken")}
                          />
                        </td>
                      </tr>
                    </Table>
                  </div>
                </Grid.Col>
              )}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="body" pt="xs">
            <Textarea
              minRows={10}
              label="Body"
              autosize
              ta={"start"}
              onChange={(e) => setBodyPayload(e.target.value)}
              value={bodyPayload}
              style={{ overflowY: "auto", maxHeight: "26rem" }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="xs">
            Settings tab content
          </Tabs.Panel>
        </Tabs>
      </Stack>
      <Stack>
        <Group>
          <Text ta={"start"} size={"sm"}>
            Response
          </Text>
          {response && (
            <>
              <Title order={6} color={getStatusColor(response?.status)}>
                {response?.status},{response?.statusText}
              </Title>
              <Text size={"sm"} color="orange">
                {axiosTimer}
              </Text>
              <Text size={"sm"} color="dimmed">
                {(
                  JSON.stringify(response.data, undefined).length / 1024
                ).toPrecision(4)}{" "}
                KB
              </Text>
            </>
          )}
        </Group>
        <ScrollArea h={500}>
          <Textarea
            minRows={20}
            autosize
            ta={"start"}
            contentEditable={false}
            size="sm"
            value={JSON.stringify(response?.data, undefined, 8)}
          />
        </ScrollArea>
      </Stack>
    </Container>
  );
};

const Container = styled.div`
  margin-left: 4rem;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 95%;
  width: 78%;
`;
const Header = styled.div`
  display: inline-flex;
  width: 100%;
`;
