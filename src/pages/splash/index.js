import React, { useContext } from "react";
import styled from "@emotion/styled";
import { Words } from "../../components";
import AnimateContext from "../../helpers/animateContext";
import { ReactComponent as Icon } from "../../layout/icon.svg";
const Center = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Header = styled("h1")`
  font-size: 8vmin !important;
`;
const Splash = () => {
  const { show } = useContext(AnimateContext);
  return (
    <Center
      css={{
        height: "90vh"
      }}
    >
      <Center css={{ width: "32vmin" }}>
        <Icon />
      </Center>
      <Header>
        <Words animate show={show}>
          Space Edventures
        </Words>
      </Header>
      <h4>
        <Words animate show={show}>
          Coming Soon
        </Words>
      </h4>
    </Center>
  );
};
export default Splash;
