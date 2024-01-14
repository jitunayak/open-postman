import {
  ActionIcon,
  Button,
  DEFAULT_THEME,
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
import { IconDeviceFloppy, IconSend2, IconTrash } from "@tabler/icons-react";
import aws4Interceptor from "aws4-axios";
import axios, { AxiosError, AxiosResponse } from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";
import React, { forwardRef, memo, useEffect, useState } from "react";
import styled from "styled-components";
import { useStore } from "../store/useStore";
import { getRequestMethodColor, getStatusColor } from "../utils/RequestUtils";
import { URLBar } from "./URLBar";
import {
  AuthenticationTypes,
  ICollectionRequest,
} from "../types/ICollectionRequest";
import { useHotkeys } from "@mantine/hooks";
import { Prism } from "@mantine/prism";

type IProps = {
  request: ICollectionRequest;
  saveRequest: (item: ICollectionRequest) => void;
};
const Playground1: React.FC<IProps> = ({ saveRequest, request }) => {
  const {
    envs,
    currentEnv,
    setCurrentEnv,
    collections,
    setCollections,
    setSelectRequest,
  } = useStore();

  const [response, setResponse] = useState<AxiosResponse>();
  const [axiosTimer, setAxiosTimer] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [saveButtonStatus, setSaveButtonStatus] = useState("Save");

  const awsForm = useForm({
    initialValues: {
      accessKeyId: "",
      secretAccessKey: "",
      sessionToken: "",
      region: "us-east-1",
    },
  });

  const form = useForm({
    initialValues: request,
  });

  const axiosTimerFunc = (startTime: number) => {
    let now = Date.now();
    let seconds = Math.floor((now - startTime) / 1000);
    let milliseconds = Math.floor((now - startTime) % 1000);
    setAxiosTimer(`${seconds}.${milliseconds} seconds`);
  };

  const [urlHistory, setUrlHistory] = useState([
    "http://localhost:3000",
    "https://dev-quotes.deno.dev/api/v1/quotes",
    "https://jsonplaceholder.typicode.com/todos",
    "https://jf5vveqi48.execute-api.us-east-1.amazonaws.com",
  ]);

  const getFinalUrlFromEnvironment = (url: string) => {
    currentEnv?.list.forEach(
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
    suggestions.add(form.values.url);
    setUrlHistory([...suggestions]);
    const actualUrl = getFinalUrlFromEnvironment(form.values.url);

    if (form.values.authorization === AuthenticationTypes.AWS_Signature) {
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
      switch (form.values.method) {
        case "GET": {
          const result = await client.get(actualUrl);
          setResponse(result);
          console.log(result);
          break;
        }
        case "POST": {
          const result = await client.post(actualUrl, form.values.bodyPayload);
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

  const handleRequestSave = () => {
    setSaveButtonStatus("Saved");
    saveRequest(form.values);
  };

  const handleDeletionOfRequest = () => {
    const collectionIndex = collections.findIndex(
      (collection) => collection.id === request.parentId
    );
    const colToUpdateIndex = collections[collectionIndex].requests.findIndex(
      (req) => req.id === request.id
    );
    const colUpdate = {
      ...collections[collectionIndex],
      ...collections[collectionIndex].requests.splice(colToUpdateIndex, 1),
    };
    const cols = collections.map((col) =>
      col.id === request.parentId ? colUpdate : col
    );
    setSelectRequest(collections[collectionIndex].requests[0]);
    setCollections(cols);
  };

  useEffect(() => {
    setResponse(undefined);
    form.setValues(request);
  }, [request]);

  useEffect(() => {
    if (saveButtonStatus === "Save") return;
    setSaveButtonStatus("Save");
  }, [form.values]);

  useHotkeys([["mod+s", () => handleRequestSave()]]);

  const SelectItem = forwardRef<HTMLDivElement, { label: string }>(
    ({ label, ...others }: { label: string }, ref) => (
      <div ref={ref} {...others}>
        <Text
          size={"xs"}
          style={{ cursor: "pointer" }}
          color={getRequestMethodColor(label)}
        >
          {label}
        </Text>
      </div>
    )
  );
  return (
    <Container>
      <Stack>
        <Group w="100%" style={{ justifyContent: "space-between" }}>
          <TextInput
            defaultValue={request.label}
            variant="unstyled"
            {...form.getInputProps("label")}
          />
          <Group>
            <ActionIcon
              variant="default"
              title="Delete current request"
              onClick={() => handleDeletionOfRequest()}
            >
              <IconTrash size={14} color={DEFAULT_THEME.colors.red[4]} />
            </ActionIcon>
            <Button
              variant="outline"
              disabled={JSON.stringify(request) === JSON.stringify(form.values)}
              size="xs"
              leftIcon={<IconDeviceFloppy size={14} />}
              onClick={() => handleRequestSave()}
            >
              {saveButtonStatus}
            </Button>
            <Select
              clearable
              size="xs"
              variant="default"
              placeholder="No Environment"
              data={envs.map((env) => ({
                label: env.label,
                value: env.id,
              }))}
              value={currentEnv?.id}
              onChange={(id) =>
                setCurrentEnv(envs.find((env) => env.id === id) ?? undefined)
              }
            />
          </Group>
        </Group>
        <Header>
          <Grid columns={24}>
            <Grid.Col span={3}>
              <Select
                size="sm"
                w={"8rem"}
                variant="filled"
                itemComponent={SelectItem}
                placeholder="METHOD"
                color="red"
                data={["GET", "POST", "PUT", "PATCH", "DELETE"]}
                styles={(theme) => ({
                  item: {
                    "&[data-selected]": {
                      "&, &:hover": {
                        backgroundColor: theme.colors.dark[5],
                      },
                    },

                    "&[data-hovered]": {},
                  },
                })}
                {...form.getInputProps("method")}
              />
            </Grid.Col>
            <Grid.Col span={18}>
              <URLBar
                setUrl={(urlString) => form.setFieldValue("url", urlString)}
                url={form.values.url}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Button
                size="sm"
                rightIcon={<IconSend2 size={16} />}
                loading={isResponseLoading}
                onClick={() => sendRequestHandler()}
              >
                Send
              </Button>
            </Grid.Col>
          </Grid>
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
                  data={[
                    {
                      label: AuthenticationTypes.Inherit,
                      value: AuthenticationTypes.Inherit,
                    },
                    {
                      value: AuthenticationTypes.No_Auth,
                      label: AuthenticationTypes.No_Auth,
                    },
                    {
                      label: AuthenticationTypes.AWS_Signature,
                      value: AuthenticationTypes.AWS_Signature,
                    },
                  ]}
                  ta={"start"}
                  w={"10rem"}
                  size="xs"
                  defaultValue={request.authorization}
                  {...form.getInputProps("authorization")}
                />
              </Grid.Col>
              {form.values.authorization ===
                AuthenticationTypes.AWS_Signature && (
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
                            placeholder="e.g. us-east-1"
                            defaultValue={awsForm.values.region}
                            {...form.getInputProps(
                              "authorizationDetails.region"
                            )}
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
                            {...form.getInputProps(
                              "authorizationDetails.accessKeyId"
                            )}
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
                            {...form.getInputProps(
                              "authorizationDetails.secretAccessKey"
                            )}
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
                            {...form.getInputProps(
                              "authorizationDetails.sessionToken"
                            )}
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
              style={{ overflowY: "auto", maxHeight: "26rem" }}
              {...form.getInputProps("bodyPayload")}
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
          <Prism language="json" noCopy>
            {isResponseLoading
              ? "fetching..."
              : !!response?.data
              ? JSON.stringify(response?.data, undefined, 4)
              : "Empty Response"}
          </Prism>
          {/* <Textarea
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
          /> */}
        </ScrollArea>
      </Stack>
    </Container>
  );
};

const Container = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 116vh;
  background-color: ${DEFAULT_THEME.colors.dark[7]};
`;
const Header = styled.div`
  width: 103%;
`;

export const Playground = memo(Playground1);
