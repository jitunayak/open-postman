import { Button, Divider, Grid, Group, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import React from "react";
import styled from "styled-components";

export const EnvironmentScreen: React.FC = () => {
  console.log("Environment");

  const envForm = useForm({
    initialValues: {
      list: [{ key: "", value: "", type: "" }],
    },
  });

  return (
    <Container>
      <Group>
        <Button
          variant="subtle"
          onClick={() =>
            envForm.insertListItem("list", { key: "", value: "", type: "" })
          }
        >
          add +
        </Button>
        <Button variant="subtle" leftIcon={<IconDeviceFloppy size={16} />}>
          Save
        </Button>
      </Group>
      <Divider py={"sm"} />
      <Paper withBorder p="lg">
        <Grid>
          {envForm.values.list.map((value, index) => (
            <>
              <Grid.Col span={4}>
                <TextInput
                  placeholder="key"
                  {...envForm.getInputProps(`list.${index}.key`)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  placeholder="value"
                  {...envForm.getInputProps(`list.${index}.value`)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <IconTrash
                  size={16}
                  onClick={() => envForm.removeListItem("list", index)}
                />
              </Grid.Col>
            </>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

const Container = styled.div`
  margin-left: 14rem;
  margin-top: 4rem;
`;
