import React from "react";
import { Table } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

export default ({ ...props }) => {
  return (
    <AnimateContext.Consumer>
      {({ show }) => <Table animate show={show} {...props} />}
    </AnimateContext.Consumer>
  );
};
