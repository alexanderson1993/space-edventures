import React from "react";
import styled from "@emotion/styled";
import { withStyles } from "@arwes/arwes";
import { transparentize } from "polished";

const NavContainer = styled("div")`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Sidebar = styled("div")`
  flex: 1;
  border-right: solid 2px rgba(0, 0, 0, 0);
  box-shadow: 5px 0px 5px ${({ color }) => transparentize(0.8, color)};
  background-color: ${({ color }) => transparentize(0.7, color)};
`;
const Content = styled("div")`
  flex: 4;
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
