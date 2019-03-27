import React, { useContext } from "react";
import { Content, Button, Link } from "../../../components";
import GET_LOGS from "./GET_LOGS.graphql";
import { useQuery } from "react-apollo-hooks";
import ProfileContext from "../../../helpers/profileContext";
import { Loading } from "@arwes/arwes";
import css from "@emotion/css";

const stardate = date => {
  var calculatedDate = new Date(date).getTime() / 1000 / 60 / 60 / 30 / 2;
  var subtraction = Math.floor(calculatedDate);
  var finalDate = (calculatedDate - subtraction) * 100000;
  return Math.floor(finalDate) / 10;
};

const OfficerLogs = () => {
  const { user } = useContext(ProfileContext);
  const { loading, data } = useQuery(GET_LOGS, { variables: { id: user.id } });
  const logs =
    data &&
    data.me &&
    data.me.logs.sort((a, b) => {
      if (a.date > b.date) return 1;
      if (a.date < b.date) return -1;
      return 0;
    });
  return (
    <Content>
      <h1>
        Log of Officer:{" "}
        {user.profile &&
          (user.profile.displayName || user.profile.name || user.profile.email)}
      </h1>
      {loading || !logs ? (
        <Loading />
      ) : (
        logs.map(l => (
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
            <Link to={`/user/flight/${l.flight.id}`}>
              <Button>View Flight Information</Button>
            </Link>
          </div>
        ))
      )}
    </Content>
  );
};
export default OfficerLogs;
