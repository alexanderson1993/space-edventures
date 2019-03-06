import React from "react";
import { Image } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ src, children, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <img animate show={show} src={src} {...props}>
          {children}
        </img>
      )}
    </AnimateContext.Consumer>
  );
};
