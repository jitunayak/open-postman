import {
  ActionIcon,
  Button,
  Checkbox,
  Input,
  Paper,
  Table,
} from "@mantine/core";
import { FORM_INDEX, useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import React, { useEffect } from "react";

interface IProps {
  id: string;
  headers: Array<{ key: string; value: string; isActive: boolean }>;
  updateHeaders: (
    headers: Array<{ key: string; value: string; isActive: boolean }>
  ) => void;
}

export const HeadersEditor: React.FC<IProps> = (props) => {
  const form = useForm({
    initialValues: { params: props.headers },
    validateInputOnBlur: [`params.${FORM_INDEX}.key`],
    validate: {
      params: (value) =>
        value.map((param) =>
          param.key.length === 0 ? "Can not be empty" : null
        ),
    },
  });

  useEffect(() => {
    form.setValues({ params: props.headers });
  }, [props.id]);

  useEffect(() => {
    props.updateHeaders(form.values.params);
  }, [form.values]);

  return (
    <Paper p="lg">
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th></th>
            <th>Key</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {form.values.params.map((_, index) => (
            <tr>
              <td>
                <Checkbox
                  size={"xs"}
                  {...form.getInputProps(`params.${index}.isActive`, {
                    type: "checkbox",
                  })}
                />
              </td>
              <td>
                <Input
                  variant="unstyled"
                  size="xs"
                  {...form.getInputProps(`params.${index}.key`)}
                />
              </td>
              <td>
                <Input
                  variant="unstyled"
                  size="xs"
                  {...form.getInputProps(`params.${index}.value`)}
                />
              </td>
              <td>
                <ActionIcon
                  onClick={() => form.removeListItem("params", index)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        mt={"xs"}
        size="xs"
        variant="subtle"
        onClick={() =>
          form.insertListItem("params", { key: "", value: "", isActive: true })
        }
      >
        Add Header
      </Button>
    </Paper>
  );
};
