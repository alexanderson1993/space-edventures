import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { DirectorContext } from "../";
import { Button, ImageUploader, Input } from "../../../components";

// const Badge = styled("div")`
//   width: 100%;
//   background-color: #1b9493;
//   display: flex;
//   padding: 20px;
//   margin-bottom: 10px;
// `;

// const Mission = styled(Badge)`
//   background-color: #1b3d94;
// `;
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
const Dashboard = () => {
  const {
    director: { center = {} }
  } = useContext(DirectorContext);
  const [name, setName] = useState(center.name);
  const [description, setDescription] = useState(center.description);
  const [website, setWebsite] = useState(center.website);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(false);
  return (
    <>
      <div
        css={css`
          float: right;
        `}
      >
        <ImageUploader src={center.imageUrl} alt={center.name} />
      </div>
      <div
        css={css`
          display: flex;
          align-items: baseline;
        `}
      >
        {editingName ? (
          <Input value={name} onChange={e => setName(e.target.value)} />
        ) : (
          <h1>{center.name}</h1>
        )}
        <div>
          <Button onClick={() => setEditingName(true)}>Update Name</Button>
        </div>
      </div>
      <h3>Description</h3>
      {editingDescription ? (
        <Input
          type="textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      ) : (
        <p>{center.description}</p>
      )}
      <div>
        <Button onClick={() => setEditingDescription(true)}>
          Update Description
        </Button>
      </div>
      <h3>Website</h3>
      {editingWebsite ? (
        <Input
          type="url"
          value={website}
          onChange={e => setWebsite(e.target.value)}
        />
      ) : (
        <a href={center.website} target="_blank" rel="noopener noreferrer">
          {center.website}
        </a>
      )}
      <div>
        <Button onClick={() => setEditingWebsite(true)}>Update Website</Button>
      </div>
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
