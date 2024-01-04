import {
  Button,
  Checkbox,
  DEFAULT_THEME,
  Divider,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import styled from "styled-components";

export const EnvironmentScreen: React.FC = () => {
  console.log("Environment");
  const [selectedEnv, setSelectedEnv] = useState(0);

  const envs = [
    { id: randomId(), label: "DEV" },
    { id: randomId(), label: "UAT" },
  ];
  const envForm = useForm({
    initialValues: {
      env: [
        {
          label: "DEV",
          list: [{ key: "", value: "", type: "" }],
        },
        {
          label: "UAT",
          list: [{ key: "", value: "", type: "" }],
        },
      ],
    },
  });

  return (
    <Container>
      <Group align="flex-start">
        <Stack>
          <Button variant="subtle" size="xs">
            Add Env
          </Button>
          {envs.map((env, index) => (
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
                envForm.insertListItem(`env.${selectedEnv}.list`, {
                  key: "",
                  value: "",
                  type: "",
                })
              }
            >
              Add +
            </Button>
            <Button
              variant="filled"
              size="xs"
              leftIcon={<IconDeviceFloppy size={16} />}
            >
              Save
            </Button>
          </Group>
          <Divider py="sm" w={"100%"} />
          {envForm.values.env[selectedEnv].list.map((_value, index) => (
            <Group>
              <Checkbox size={"xs"} />
              <TextInput
                placeholder="Variable"
                {...envForm.getInputProps(
                  `env.${selectedEnv}.list.${index}.key`
                )}
              />
              <TextInput
                placeholder="Value"
                {...envForm.getInputProps(
                  `env.${selectedEnv}.list.${index}.value`
                )}
              />
              <IconTrash
                size={16}
                onClick={() =>
                  envForm.removeListItem(`env.${selectedEnv}.list`, index)
                }
              />
            </Group>
          ))}
        </Stack>
      </Group>
    </Container>
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
