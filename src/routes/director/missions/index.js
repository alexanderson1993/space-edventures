import React, { useContext, useState } from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import MISSIONS_QUERY from "./missions.graphql";
import { Link, Button, Input } from "../../../components";
import { Loading, Project } from "@arwes/arwes";
import { CenterContext } from "../../../pages/director";
import css from "@emotion/css";
const ButtonAlign = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  h1 {
    margin-right: 20px;
    margin-bottom: 0;
  }
`;

const MissionList = ({ missions, center }) => {
  return (
    <ul>
      {missions.map(s => (
        <li key={s.id}>
          <Link to={`/director/${center.id}/missions/${s.id}`}>{s.name}</Link>
        </li>
      ))}
    </ul>
  );
};
const MissionIndex = React.memo(props => {
  const center = useContext(CenterContext) || {};
  const [filter, setFilter] = useState(null);
  return (
    <div>
      <ButtonAlign>
        <h1>Missions</h1>
        <Link to={`/director/${center.id}/missions/create`}>
          <Button>Create Mission</Button>
        </Link>
        <Input
          type="text"
          placeholder="Search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </ButtonAlign>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}
      >
        <Query query={MISSIONS_QUERY} variables={{ centerId: center.id }}>
          {({ loading, data, error }) => {
            if (loading) return <Loading animate />;
            if (error) return <div>There is an error: {error.message}</div>;
            const { missions } = data;
            if (filter) {
              return (
                <MissionList
                  missions={missions.filter(m =>
                    new RegExp(filter, "gi").test(m.name)
                  )}
                  center={center}
                />
              );
            }
            const simulators = missions.reduce((acc, mission) => {
              let key = "No Simulator Assignment";
              if (mission.simulators.length > 0) {
                key = mission.simulators.map(s => s.name).join(", ");
              }
              acc[key] = acc[key] ? acc[key].concat(mission) : [mission];

              return acc;
            }, {});
            return missions && missions.length ? (
              Object.entries(simulators).map(([key, missions]) => (
                <Project
                  key={key}
                  header={key}
                  css={css`
                    display: inline-block;
                    margin-bottom: 20px;
                  `}
                >
                  <MissionList center={center} missions={missions} />
                </Project>
              ))
            ) : (
              <p>No Missions.</p>
            );
          }}
        </Query>
      </div>
    </div>
  );
});

export default MissionIndex;
