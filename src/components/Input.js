import React from "react";
import { Frame, withStyles } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";
import { Input } from "reactstrap";

export default withStyles(() => {})(({ style, theme, block, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <div style={{ display: block ? "block" : "inline-block" }}>
          <Frame animate show={show} level={2} corners={2} {...props}>
            <Input
              {...props}
              style={{
                background: "transparent",
                border: "transparent",
                color: theme.color.primary.base,
                padding: "5px 10px",
                ...style
              }}
            />
          </Frame>
        </div>
      )}
    </AnimateContext.Consumer>
  );
});
