import React from "react";
import styled from "@emotion/styled";
import { withStyles } from "@arwes/arwes";
import Sidebar from "./Sidebar";

const NavContainer = styled("div")`
  height: 100%;
  flex: 4;
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;
const Content = styled("div")`
  padding-left: 20px;
  flex: 1;
`;

const Navigation = ({ children, theme }) => {
  return (
    <NavContainer>
      <Sidebar color={theme.color.primary.base} />
      <Content>{children}</Content>
    </NavContainer>
  );
};

export default withStyles(() => {})(Navigation);
