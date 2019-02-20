import React, { useContext } from "react";
import styled from "@emotion/styled";
import { DirectorContext } from ".";
import css from "@emotion/css";
// import { Link, Button } from "../../components";

const Badge = styled("div")`
  width: 100%;
  background-color: #1b9493;
  display: flex;
  padding: 20px;
  margin-bottom: 10px;
`;

const Mission = styled(Badge)`
  background-color: #1b3d94;
`;
const Highlight = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Num = styled("p")`
  font-family: "Electrolize", "sans-serif";
  font-size: 40px;
  font-weight: 800;
`;
const Dashboard = props => {
  const {
    director: { center = {} }
  } = useContext(DirectorContext);
  return (
    <>
      <img
        src={center.imageUrl}
        css={css`
          float: right;
        `}
        alt={center.name}
      />
      <h1>{center.name}</h1>
      <h3>Description</h3>
      <p>{center.description}</p>
      <h3>Website</h3>
      <a href={center.website} target="_blank" rel="noopener noreferrer">
        {center.website}
      </a>
      <div
        css={css`
          display: flex;
          justify-content: space-around;
        `}
      >
        <Highlight>
          <Num>{center.simulatorCount}</Num>
          <p>Simulators</p>
        </Highlight>
        <Highlight>
          <Num>{center.missionCount}</Num>
          <p>Missions</p>
        </Highlight>
        <Highlight>
          <Num>{center.badgeCount}</Num>
          <p>Badges</p>
        </Highlight>
      </div>
    </>
  );
};

export default Dashboard;
