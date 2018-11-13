import React from "react";
import { Image } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ src, children, ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => (
        <Image animate show={show} resources={src} {...props}>
          {children}
        </Image>
      )}
    </AnimateContext.Consumer>
  );
};
