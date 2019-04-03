import React from "react";
import { Words } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ children, show, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show: contextShow }) => (
        <Words
          animate
          show={show || show === false ? show : contextShow}
          {...props}
        >
          {children}
        </Words>
      )}
    </AnimateContext.Consumer>
  );
};
