import React from "react";
import AnimateContext from "../helpers/animateContext";

export default ({ imgProps, alt, ...rest }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => <img {...rest} alt={alt} {...imgProps} />}
    </AnimateContext.Consumer>
  );
};
