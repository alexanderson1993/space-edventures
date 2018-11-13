import React from "react";
import { Words } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ children, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <Words animate show={show}>
          {children}
        </Words>
      )}
    </AnimateContext.Consumer>
  );
};
