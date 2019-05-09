import React, { lazy, Suspense, useState, useContext } from "react";
import { Input, Button, Words, Table } from "../../../components";

import { withApollo, Query } from "react-apollo";
import GET_RANK from "./getRank.graphql";
import GET_MISSIONS from "../missions/missions.graphql";
import { CenterContext } from "../../../pages/director";
import { Blockquote, Loading } from "@arwes/arwes";
import css from "@emotion/css";
import graphQLHelper from "../../../helpers/graphQLHelper";

const QRScanner = lazy(() => import("../../../components/QrScanner"));

const Checker = ({ client }) => {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qr, setQr] = useState(false);

  const center = useContext(CenterContext);
  const missions = users
    .reduce((prev, next) => prev.concat(next.missions), [])
    .filter((a, i, arr) => arr.findIndex(m => m.id === a.id) === i);

  const processId = token => {
    setError(null);
    setLoading(true);
    client
      .query({
        query: GET_RANK,
        variables: { id: token, centerId: center.id }
      })
      .then(res => {
        setLoading(false);
        if (res.errors) {
          return setError(res.errors[0]);
        }
        if (users.find(u => u.id === res.data.userGetRank.id)) return;
        setUsers(u => u.concat(res.data.userGetRank));
      })
      .catch(err => {
        setLoading(false);
        return setError(err);
      });
  };
  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding-right: 20px;
        `}
      >
        <div>
          <h1>Rank Check</h1>
          <p>Enter the participant's email address or officer code.</p>
          {loading ? (
            <Loading animate />
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                processId(id);
                setId("");
              }}
            >
              <Input
                value={id}
                onChange={e => {
                  setId(e.target.value);
                  setError(null);
                }}
              />
              <div>
                <Button type="submit">Add User</Button>
              </div>
              {error && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </form>
          )}
        </div>
        <div>
          {!qr ? (
            <Button onClick={() => setQr(true)}>Use QR Scanner</Button>
          ) : (
            <Suspense fallback={<Loading animate />}>
              <QRScanner
                width={100}
                onCode={code => {
                  if (scannedCodes.indexOf(code.data) > -1) return;
                  setScannedCodes(s => s.concat(code.data));
                  processId(code.data);
                }}
              />
            </Suspense>
          )}
        </div>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <Table
          css={css`
            flex: 3;
            margin-right: 20px;
          `}
        >
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Age</th>
                <th>Rank</th>
                <th>Flight Hours</th>
                <th>Class Hours</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.profile.age}</td>
                  <td>{u.profile.rank.name}</td>
                  <td>{u.profile.flightHours}</td>
                  <td>{u.profile.classHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
        <div
          css={css`
            flex: 1;
          `}
        >
          {users.length > 0 && (
            <>
              <h3>Uncompleted Missions</h3>
              <Query query={GET_MISSIONS} variables={{ centerId: center.id }}>
                {graphQLHelper(({ missions: allMissions }) => (
                  <ul>
                    {allMissions
                      .filter(m => !missions.find(mm => mm.id === m.id))
                      .map(m => (
                        <li key={m.id}>{m.name}</li>
                      ))}
                  </ul>
                ))}
              </Query>
              <h3>Completed Missions</h3>
              <ul>
                {missions.map(m => (
                  <li key={m.id}>{m.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withApollo(Checker);
