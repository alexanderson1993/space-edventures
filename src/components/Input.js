import React from "react";
import { Frame, withStyles } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";
import styled from "@emotion/styled";

const Input = styled("input")`
  color: ${({ theme }) => theme.color.primary.base};
  background: transparent;
  border: transparent;
  padding: 5px 10px;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  width: 100%;
`;
export default withStyles(() => {})(({ style, theme, block, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <div style={{ display: block ? "block" : "inline-block" }}>
          <Frame animate show={show} level={2} corners={2} {...props}>
            <Input {...props} theme={theme} />
          </Frame>
        </div>
      )}
    </AnimateContext.Consumer>
  );
});
