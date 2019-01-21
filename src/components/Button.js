import React from "react";
import { Button, Words } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ children, block, style, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <Button
          animate
          show={show}
          {...props}
          style={{
            display: block ? "block" : "inline-block",
            textAlign: "center",
            ...style
          }}
        >
          {anim2 => (
            <Words animate show={anim2.entered}>
              {children}
            </Words>
          )}
        </Button>
      )}
    </AnimateContext.Consumer>
  );
};
