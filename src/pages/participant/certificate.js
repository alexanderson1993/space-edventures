import React from "react";
import styled from "@emotion/styled";
import { Words } from "../../components";

const Container = styled("div")`
  text-align: center;
`;

const Certificate = ({ rank = "Ensign", name = "Raphael Mancini" }) => {
  return (
    <Container>
      <h1>
        <Words>Certificate of Rank Advancement</Words>
      </h1>
      <p>
        <Words>For Achieving the Space Edventures Rank of</Words>
      </p>
      <h2>
        <Words>{rank}</Words>
      </h2>
      <p>
        <Words>Awarded to</Words>
      </p>
      <h3>
        <Words>{name}</Words>
      </h3>
      <p>
        <Words>On this date of</Words>
      </p>
      <h4>
        <Words>{new Date().toDateString()}</Words>
      </h4>
    </Container>
  );
};

export default Certificate;
