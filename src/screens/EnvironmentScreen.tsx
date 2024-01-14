import {
  Button,
  Checkbox,
  DEFAULT_THEME,
  Divider,
  Group,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import styled from "styled-components";
import { useStore } from "../store/useStore";

export const EnvironmentScreen: React.FC = () => {
  const { envs, setEnvs } = useStore();
  const [selectedEnv, setSelectedEnv] = useState(0);

  const envList = envs.map((ev) => ({
    id: ev.id,
    label: ev.label,
  }));

  const envForm = useForm({
    initialValues: {
      envs,
    },
    validate: {
      envs: {
        label: (value) =>
          value.length <= 0 ? "First name is too short" : null,
      },
    },
  });

  function addEnvItem(): void {
    return envForm.insertListItem(`envs.${selectedEnv}.list`, {
      key: "",
      value: "",
      isChecked: true,
      type: "TEXT",
    });
  }

  return (
    <form>
      <Container>
        <Group align="flex-start" w="100%">
          <Stack w="2%">
            <Button variant="subtle" size="xs">
              Add Env
            </Button>
            {envList.map((env, index) => (
              <SideBarItem
                $active={index === selectedEnv}
                onClick={() => setSelectedEnv(index)}
                key={env.id}
              >
                {env.label}
              </SideBarItem>
            ))}
          </Stack>
          <Divider orientation="vertical" />
          <Stack w="18%">
            <Group mb="sm" align="center">
              <Button variant="outline" size="xs" onClick={() => addEnvItem()}>
                Add +
              </Button>
              <Button
                size="xs"
                variant="filled"
                disabled={
                  JSON.stringify(envForm.values.envs) === JSON.stringify(envs)
                }
                leftIcon={<IconDeviceFloppy size={16} />}
                onClick={() => {
                  envForm.validate();
                  setEnvs(envForm.values.envs);
                }}
              >
                Save
              </Button>
            </Group>
            <Divider py="sm" w={"70%"} />
            {envForm.values.envs[selectedEnv].list.map((value, index) => (
              <Group w={"100%"}>
                <Checkbox
                  size={"xs"}
                  {...envForm.getInputProps(
                    `envs.${selectedEnv}.list.${index}.isChecked`,
                    { type: "checkbox" }
                  )}
                />
                <TextInput
                  size="xs"
                  placeholder="Variable"
                  required
                  withAsterisk
                  {...envForm.getInputProps(
                    `envs.${selectedEnv}.list.${index}.key`
                  )}
                />
                <Select
                  size="xs"
                  w={"10rem"}
                  data={[
                    { value: "TEXT", label: "Text" },
                    { value: "SECRET", label: "Secret" },
                  ]}
                  {...envForm.getInputProps(
                    `envs.${selectedEnv}.list.${index}.type`
                  )}
                />
                {value.type.toString() === "SECRET" ? (
                  <PasswordInput
                    w={"40%"}
                    size="xs"
                    placeholder="Value"
                    {...envForm.getInputProps(
                      `envs.${selectedEnv}.list.${index}.value`
                    )}
                  />
                ) : (
                  <TextInput
                    w={"40%"}
                    size="xs"
                    placeholder="Value"
                    {...envForm.getInputProps(
                      `envs.${selectedEnv}.list.${index}.value`
                    )}
                  />
                )}
                <IconTrash
                  size={16}
                  onClick={() =>
                    envForm.removeListItem(`envs.${selectedEnv}.list`, index)
                  }
                />
              </Group>
            ))}
          </Stack>
        </Group>
      </Container>
    </form>
  );
};

const Container = styled.div`
  margin-top: 2rem;
  width: 1000vh;
`;

const SideBarItem = styled.div<{ $active: boolean }>`
  cursor: pointer;
  padding: 0.6rem 1rem;
  font-size: 10pt;
  border-right: ${(props) =>
    props.$active
      ? `2px solid ${DEFAULT_THEME.colors.orange[6]}`
      : "2px solid transparent"};
  background-color: ${(props) =>
    props.$active ? DEFAULT_THEME.colors.dark[6] : "transparent"};
`;
