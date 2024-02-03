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
  queryParams: Array<{ key: string; value: string; isActive: boolean }>;
  updateUrl: (e: string) => void;
  url: string;
}

export const QueryParamsInput: React.FC<IProps> = (props) => {
  const form = useForm({
    initialValues: { params: props.queryParams },
    validateInputOnBlur: [`params.${FORM_INDEX}.key`],
    validate: {
      params: (value) =>
        value.map((param) =>
          param.key.length === 0 ? "Can not be empty" : null
        ),
    },
  });

  const buildQueryUrl = () => {
    let queryUrl = "";
    form.values.params.forEach((param, index) => {
      queryUrl =
        param.isActive && param.key.length > 0
          ? `${queryUrl}${param.key}=${param.value}`
          : queryUrl;

      if (
        index !== form.values.params.filter((p) => p.isActive).length - 1 &&
        param.isActive &&
        param.key.length > 0
      ) {
        queryUrl += "&";
      }
    });
    return queryUrl;
  };

  useEffect(() => {
    form;
    const queryUrl = buildQueryUrl();
    console.log(form.values.params);
    console.log(queryUrl);
    props.updateUrl(
      props.url.split("?").at(0) + (queryUrl.length > 0 ? "?" + queryUrl : "")
    );
    console.log(buildQueryUrl());
  }, [form.values]);

  return (
    <Paper p="lg">
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Select</th>
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
        Add Query Param
      </Button>
    </Paper>
  );
};
