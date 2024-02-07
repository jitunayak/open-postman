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
import { useStore } from "../store/useStore";

type IQueryParam = Array<{ key: string; value: string; isActive: boolean }>;
interface IProps {
  queryParams: IQueryParam;
  updateUrl: (e: string) => void;
  url: string;
  id: string;
}

export const QueryParamsInput: React.FC<IProps> = (props) => {
  const { currentEnv } = useStore();

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
  const getFinalUrlFromEnvironment = (url: string) => {
    currentEnv?.list.forEach(
      (env) => (url = url.replaceAll(`{{${env.key}}}`, env.value))
    );
    return url;
  };

  useEffect(() => {
    const urlOb = new URL(getFinalUrlFromEnvironment(props.url));
    const params = urlOb.searchParams;
    console.log(params);

    const queryParamsFromUrl: IQueryParam = [];
    params.forEach((value, key) => {
      queryParamsFromUrl.push({
        isActive: true,
        key: key,
        value: value,
      });
    });

    console.log(queryParamsFromUrl);
    // form.setValues({ params: queryParamsFromUrl });
  }, [props.id]);

  useEffect(() => {
    const queryUrl = buildQueryUrl();
    props.updateUrl(
      props.url.split("?").at(0) + (queryUrl.length > 0 ? "?" + queryUrl : "")
    );
  }, [form.values, props.id]);

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
        Add Query Param
      </Button>
    </Paper>
  );
};
