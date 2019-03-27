import React, { useContext } from "react";
import { useQuery } from "react-apollo-hooks";
import GET_LOGS from "./GET_LOGS.graphql";
import ProfileContext from "../../helpers/profileContext";
import { Loading } from "@arwes/arwes";
import css from "@emotion/css";

const OfficerLog = () => {
  const { user } = useContext(ProfileContext);
  const { loading, data } = useQuery(GET_LOGS, { variables: { id: user.id } });
  const log =
    data &&
    data.me &&
    data.me.logs.sort((a, b) => {
      if (a.date > b.date) return 1;
      if (a.date < b.date) return -1;
      return 0;
    })[0];
  return (
    <div>
      {loading ? (
        <Loading animate />
      ) : log ? (
        <div>
          <p>
            <strong>{new Date(log.date).toLocaleDateString()}</strong>
          </p>
          <p
            css={css`
              position: relative;
              height: 5.8em;
              overflow-y: auto;
            `}
          >
            {log.log}
          </p>
        </div>
      ) : (
        "No recent officers log entries."
      )}
    </div>
  );
};
export default OfficerLog;
