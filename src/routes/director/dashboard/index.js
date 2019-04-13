import React, { useState, useContext } from "react";
import css from "@emotion/css";
import { Button, Auth } from "../../../components";
import { CenterContext } from "../../../pages/director";
import Name from "./name";
import Description from "./description";
import Website from "./website";
import ImageContainer from "./image";
import Address from "./address";
import { Highlight, Num } from "./styles";

const Dashboard = () => {
  const center = useContext(CenterContext);
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Auth roles={["director"]}>
        <Button
          css={css`
            float: right;
            margin-right: 20px;
          `}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done Editing" : "Edit"}
        </Button>
      </Auth>
      <Name {...center} editMode={editMode} />
      <div
        css={css`
          margin-top: 60px;
        `}
      >
        <h2>Statistics</h2>
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
          <Highlight>
            <Num>{center.flightRecordCount}</Num>
            <p>Flights</p>
          </Highlight>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          & > div {
            flex: 1;
            padding: 0 1rem;
          }
        `}
      >
        <Description {...center} editMode={editMode} />
        <ImageContainer {...center} editMode={editMode} />
        <Website {...center} editMode={editMode} />
      </div>
      <Address {...center} editMode={editMode} />
    </>
  );
};

export default Dashboard;
