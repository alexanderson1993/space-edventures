import React from "react";
import { Button, Words } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ children, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <Button animate show={show} {...props}>
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
