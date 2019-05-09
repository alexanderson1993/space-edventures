import React, { useContext } from "react";
import { Content, Button, Link } from "../../../components";
import GET_LOGS from "./GET_LOGS.graphql";
import { useQuery } from "react-apollo-hooks";
import ProfileContext from "../../../helpers/profileContext";
import { Loading, Project } from "@arwes/arwes";
import css from "@emotion/css";

const stardate = date => {
  var calculatedDate = new Date(date).getTime() / 1000 / 60 / 60 / 30 / 2;
  var subtraction = Math.floor(calculatedDate);
  var finalDate = (calculatedDate - subtraction) * 100000;
  return Math.floor(finalDate) / 10;
};

function dateSort(a, b) {
  if (a.date > b.date) return 1;
  if (a.date < b.date) return -1;
  return 0;
}
const OfficerLogs = () => {
  const { user } = useContext(ProfileContext);
  const { loading, data } = useQuery(GET_LOGS, { variables: { id: user.id } });
  const flights =
    (data &&
      data.me &&
      Object.values(
        data.me.logs.reduce((acc, log) => {
          const logInfo = {
            id: log.id,
            flightId: log.flight.id,
            date: log.date,
            log: log.log
          };
          acc[log.flight.id] = acc[log.flight.id]
            ? {
                ...acc[log.flight.id],
                logs: acc[log.flight.id].logs.concat(logInfo)
              }
            : {
                id: log.flight.id,
                date: log.flight.date,
                simulator: log.flight.simulator.name,

                stationName: log.flight.stationName,
                logs: [logInfo]
              };
          return acc;
        }, {})
      ).sort(dateSort)) ||
    null;
  return (
    <Content>
      <h1>
        Log of Officer:{" "}
        {user.profile &&
          (user.profile.displayName || user.profile.name || user.profile.email)}
      </h1>
      {loading || !flights ? (
        <Loading />
      ) : (
        flights.map(f => (
          <Project
            key={f.flightId}
            animate
            header={`${f.simulator} - ${f.stationName}${
              f.date ? ` - ${new Date(f.date).toLocaleDateString()}` : ""
            }`}
          >
            {f.logs.sort(dateSort).map(l => (
              <div
                key={l.id}
                css={css`
                  margin-bottom: 2em;
                `}
              >
                <h2>Stardate: {stardate(l.date)}</h2>
                <pre
                  css={css`
                    white-space: pre-line;
                  `}
                >
                  {l.log}
                </pre>
              </div>
            ))}
            <Link to={`/user/flight/${f.id}`}>
              <Button>View Flight Information</Button>
            </Link>
          </Project>
        ))
      )}
    </Content>
  );
};
export default OfficerLogs;
