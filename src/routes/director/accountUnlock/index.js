import React, { lazy, Suspense, useState, useContext } from "react";
import { Input, Button, Words } from "../../../components";

import { withApollo, Mutation } from "react-apollo";
import GET_RANK from "./getRank.graphql";
import UNLOCK_ACCOUNT from "./unlockAccount.graphql";
import { CenterContext } from "../../../pages/director";
import { Blockquote, Loading } from "@arwes/arwes";
import css from "@emotion/css";

const QRScanner = lazy(() => import("../../../components/QrScanner"));

const Checker = ({ client }) => {
  const [user, setUser] = useState();
  const [id, setId] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qr, setQr] = useState(false);

  const center = useContext(CenterContext);

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
        setUser(res.data.userGetRank);
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
          <h1>Account Unlock</h1>
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
      <div>
        {user && (
          <>
            <h3>Unlock the account of {user.profile.name}?</h3>
            <p>
              <strong>
                Be sure to confirm the age of the participant and the parent's
                email address.
              </strong>
            </p>
            <p>Age: {user.profile.age}</p>
            <p>Parent Email: {user.parentEmail}</p>
            <Mutation
              mutation={UNLOCK_ACCOUNT}
              variables={
                console.log({ centerId: center.id, userId: user.id }) || {
                  centerId: center.id,
                  userId: user.id
                }
              }
            >
              {(action, { loading, data }) => {
                if (loading) return <Loading />;
                if (data) return <h3>Account Unlocked.</h3>;
                return <Button onClick={action}>Unlock Account</Button>;
              }}
            </Mutation>
          </>
        )}
      </div>
    </div>
  );
};

export default withApollo(Checker);
