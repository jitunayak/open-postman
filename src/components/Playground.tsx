import {
  Button,
  Divider,
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
import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import { useStore } from "../store/useStore";
import { getStatusColor } from "../utils/RequestUtils";
import { URLBar } from "./URLBar";
// const AwsClient = require("aws4fetch");
// import aws4 from "aws4-browser";

type IProps = {
  initialUrl?: string;
  initialMethodType?: string;
  initialBodyPayload?: string;
};
const Playground1: React.FC<IProps> = ({
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
  const [isResponseLoading, setIsResponseLoading] = useState(false);

  const awsForm = useForm({
    initialValues: {
      accessKeyId: "",
      secretAccessKey: "",
      sessionToken: "",
      region: "us-east-1",
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
    "https://jf5vveqi48.execute-api.us-east-1.amazonaws.com",
  ]);

  const { envs } = useStore();
  const getFinalUrlFromEnvironment = (url: string) => {
    envs[0].list.forEach(
      (env) => (url = url.replaceAll(`{{${env.key}}}`, env.value))
    );
    return url;
  };

  const sendRequestHandler = async () => {
    setIsResponseLoading(true);
    setResponse(undefined);
    let startTime = Date.now();
    const client = axios.create({ adapter: axiosTauriApiAdapter });

    const suggestions = new Set(urlHistory);
    suggestions.add(url);
    setUrlHistory([...suggestions]);
    const actualUrl = getFinalUrlFromEnvironment(url);

    if (authorization === "AWS Signature") {
      const { accessKeyId, secretAccessKey, sessionToken, region } =
        awsForm.values;
      const interceptor = aws4Interceptor({
        options: {
          region,
          service: "execute-api",
        },
        credentials: {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        },
      });

      client.interceptors.request.use(interceptor);
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
      const error = err as AxiosError;
      axiosTimerFunc(startTime);
      setResponse(error.response);
    } finally {
      setIsResponseLoading(false);
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
            w={"10rem"}
          />

          <URLBar setUrl={setUrl} url={url} />
          <Button
            size="sm"
            style={{ position: "absolute", right: "0" }}
            rightIcon={<IconSend2 size={16} />}
            loading={isResponseLoading}
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
                  size="xs"
                />
              </Grid.Col>
              {authorization === "AWS Signature" && (
                <Grid.Col span={8}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Table verticalSpacing={"md"}>
                      <tr>
                        <td>
                          <Text size="sm" ta={"start"}>
                            Region
                          </Text>
                        </td>
                        <td>
                          <TextInput
                            placeholder="us-east-1"
                            defaultValue={awsForm.values.region}
                            {...awsForm.getInputProps("region")}
                          />
                        </td>
                      </tr>
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
        <Divider />
        <Group>
          <Text ta={"start"} size={"sm"}>
            Response
          </Text>
          {response && (
            <>
              <Title order={6} color={getStatusColor(response?.status)}>
                {response?.status} ({response?.statusText})
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
            value={
              isResponseLoading
                ? "fetching..."
                : !!response?.data
                ? JSON.stringify(response?.data, undefined, 8)
                : "Empty Response"
            }
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

export const Playground = memo(Playground1);
