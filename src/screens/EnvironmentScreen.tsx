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
import { Form, useForm } from "@mantine/form";
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

  return (
    <form>
      <Container>
        <Group align="flex-start">
          <Stack>
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
          <Stack>
            <Group mb="sm" align="center">
              <Button
                variant="outline"
                size="xs"
                onClick={() =>
                  envForm.insertListItem(`envs.${selectedEnv}.list`, {
                    key: "",
                    value: "",
                    isChecked: true,
                    type: "TEXT",
                  })
                }
              >
                Add +
              </Button>
              <Button
                variant="filled"
                disabled={
                  JSON.stringify(envForm.values.envs) === JSON.stringify(envs)
                }
                size="xs"
                leftIcon={<IconDeviceFloppy size={16} />}
                onClick={() => {
                  envForm.validate();
                  setEnvs(envForm.values.envs);
                }}
              >
                Save
              </Button>
            </Group>
            <Divider py="sm" w={"100%"} />
            {envForm.values.envs[selectedEnv].list.map((value, index) => (
              <Group>
                <Checkbox
                  size={"xs"}
                  {...envForm.getInputProps(
                    `envs.${selectedEnv}.list.${index}.isChecked`,
                    { type: "checkbox" }
                  )}
                />
                <TextInput
                  placeholder="Variable"
                  required
                  withAsterisk
                  {...envForm.getInputProps(
                    `envs.${selectedEnv}.list.${index}.key`
                  )}
                />
                <Select
                  w={"10rem"}
                  {...envForm.getInputProps(
                    `envs.${selectedEnv}.list.${index}.type`
                  )}
                  data={[
                    { value: "TEXT", label: "Text" },
                    { value: "SECRET", label: "Secret" },
                  ]}
                />
                {value.type.toString() === "SECRET" ? (
                  <PasswordInput
                    w={"15rem"}
                    placeholder="Value"
                    {...envForm.getInputProps(
                      `envs.${selectedEnv}.list.${index}.value`
                    )}
                  />
                ) : (
                  <TextInput
                    w={"15rem"}
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
  margin-left: 7rem;
  margin-top: 2rem;
  width: 1000vh;
`;

const SideBarItem = styled.div<{ $active: boolean }>`
  cursor: pointer;
  padding: 0.6rem 4rem;
  font-size: 10pt;
  border-radius: ${DEFAULT_THEME.radius.xs};
  border-right: ${(props) =>
    props.$active
      ? `2px solid ${DEFAULT_THEME.colors.orange[6]}`
      : "2px solid transparent"};
  background-color: ${(props) =>
    props.$active ? DEFAULT_THEME.colors.dark[6] : "transparent"};
`;
