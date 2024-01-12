import { DEFAULT_THEME, Mark, Text, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useKeyPress from "../hooks/KeyboardUtils";
import { useStore } from "../store/useStore";

type IProps = {
  url: string;
  setUrl: (url: string) => void;
};
export const URLBar: React.FC<IProps> = ({ setUrl, url }) => {
  const x = [];
  const { envs, currentEnv } = useStore();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownSelection, setDropDownSelection] = useState(0);

  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const escPressed = useKeyPress("Escape");

  useEffect(() => {
    if (arrowUpPressed) {
      dropDownSelection === 0
        ? setDropDownSelection(envs[0].list.length - 1)
        : setDropDownSelection(dropDownSelection - 1);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      dropDownSelection === envs[0].list.length - 1
        ? setDropDownSelection(0)
        : setDropDownSelection(dropDownSelection + 1);
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    if (enterPressed) {
      if (!showDropDown) {
        setShowDropDown(true);
        return;
      }

      const result =
        url.slice(0, cursorPosition) +
        `${envs[0].list[dropDownSelection].key}}}` +
        url.slice(cursorPosition);
      setUrl(result);
      setShowDropDown(false);
    }
  }, [enterPressed]);

  useEffect(() => {
    if (escPressed) {
      setShowDropDown(false);
    }
  }, [escPressed]);

  useEffect(() => {
    setUrl("https://");
  }, [url.length === 0]);
  return (
    <>
      <Container>
        <URLBarHighlight
          suppressContentEditableWarning
          onBlur={(e) => setUrl(e.target.innerText)}
        >
          {url.split(/{{(.*?)}}/g).map((value) => (
            <>
              {url.search(`{{${value}}}`) < 0 ? (
                <Text color="white">{value}</Text>
              ) : (
                <Tooltip
                  withArrow
                  label={
                    currentEnv?.list.find((l) => l.key === value)?.value ??
                    "undefined"
                  }
                >
                  <Mark
                    style={{
                      padding: 0,
                      margin: 0,
                      backgroundColor: "transparent",
                      color: DEFAULT_THEME.colors.orange[8],
                    }}
                  >
                    {`{{${value}}}`}
                  </Mark>
                </Tooltip>
              )}
            </>
          ))}
        </URLBarHighlight>

        <HiddenUserInput
          placeholder=""
          autoComplete=""
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setCursorPosition(e.target.selectionEnd ?? 0);
            if (
              e.target.value.endsWith("{{") ||
              e.target.value.substring(0, cursorPosition).endsWith("{")
            ) {
              setShowDropDown(true);
            } else {
              setShowDropDown(false);
            }
          }}
        />
      </Container>
      {showDropDown && (
        <DropDownBox
          left={`${
            cursorPosition > 50 ? cursorPosition - 40 : cursorPosition
          }rem`}
        >
          <table>
            {envs[0].list.map((item, index) => (
              <tr
                key={index}
                style={{
                  color: "white",
                  backgroundColor:
                    index === dropDownSelection
                      ? DEFAULT_THEME.colors.orange[7]
                      : "transparent",
                }}
              >
                <td>
                  <DropDownItem
                    onClick={() => {
                      //  setUrl(`${url}${item.key}}}`);
                      const result =
                        url.slice(0, cursorPosition) +
                        `${item.key}}}` +
                        url.slice(cursorPosition);
                      setUrl(result);
                      setShowDropDown(false);
                    }}
                  >
                    {item.key}
                  </DropDownItem>
                </td>
                <td
                  style={{
                    padding: "0rem 1rem",
                    color:
                      index === dropDownSelection
                        ? "#eee"
                        : DEFAULT_THEME.colors.dark[0],
                  }}
                >
                  {item.value}
                </td>
              </tr>
            ))}
          </table>
        </DropDownBox>
      )}
    </>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const HiddenUserInput = styled.input`
  font: inherit;
  /* left: 10rem; */
  width: 100%;
  height: 16px;
  position: absolute;
  background-color: transparent;
  color: transparent;
  outline: none;
  font-size: 11pt;
  margin: 0.6rem 0.6rem;
  padding: 0.3rem 1rem;
  align-items: center;
  display: block;
  align-content: center;
  border: 1px solid transparent;
  caret-color: yellow;
  caret-shape: auto;
`;

const URLBarHighlight = styled.div`
  outline: none;
  position: absolute;
  width: 100%;
  /* left: 10rem; */
  font-size: 11pt;
  margin: 0rem 0.6rem;
  padding: 0.35rem 1rem;
  align-items: center;
  display: inline-flex;
  align-content: center;
  background-color: ${DEFAULT_THEME.colors.dark[6]};
  border-radius: ${DEFAULT_THEME.radius.sm};
  border: ${`1.5px solid ${DEFAULT_THEME.colors.dark[4]}`};
`;

const DropDownItem = styled.span`
  cursor: pointer;
  padding: 0.2rem 0.6rem;
  font-size: smaller;
  font-weight: 600;
  /* background-color: red; */
  /* border-radius: ${DEFAULT_THEME.radius.xs}; */
  /* border-bottom: 1px solid ${DEFAULT_THEME.colors.dark[3]}; */
`;
const DropDownBox = styled.div<{ left: string }>`
  position: absolute;
  z-index: 20;
  left: ${(props) => props.left};
  border-radius: ${DEFAULT_THEME.radius.sm};
  background-color: ${DEFAULT_THEME.colors.dark[5]};
  display: flex;
  margin-top: 2.6rem;
  flex-direction: column;
  border: 1px solid ${DEFAULT_THEME.colors.dark[3]};
`;
