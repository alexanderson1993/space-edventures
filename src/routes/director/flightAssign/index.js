import React, { lazy, useState, useContext, Suspense, useReducer } from "react";
import { Input, Button, Words } from "../../../components";
import { Blockquote, Loading } from "@arwes/arwes";
import { CenterContext } from "../../../pages/director";
import { useApolloClient, useQuery, useMutation } from "react-apollo-hooks";
import CREATE_FLIGHT from "./createFlight.graphql";
import GET_RANK from "../rankChecker/getRank.graphql";
import ASSIGN_QUERY from "./assignQuery.graphql";
import ME_QUERY from "../../../queries/me.graphql";
import css from "@emotion/css";
import uuid from "uuid";
import AuthContext from "../../../helpers/authContext";
const QRScanner = lazy(() => import("../../../components/QrScanner"));

const pickerReducer = (state, action) => {
  if (action.type === "setSimulator") {
    return { ...state, simulator: action.value };
  }
  if (action.type === "setMission") {
    return { ...state, mission: action.value };
  }
  if (action.type === "setFlightType") {
    return { ...state, flightType: action.value };
  }
  if (action.type === "clear") {
    return {};
  }
};
const Picker = ({ userId, data, values, dispatch }) => {
  const { user } = useContext(AuthContext);
  const { simulators, missions, /*badges,*/ flightTypes } = data;
  const { simulator, mission, flightType } = values;
  const [loading, setLoading] = useState(false);
  const center = useContext(CenterContext);
  const createFlight = useMutation(CREATE_FLIGHT, {
    variables: {
      centerId: center.id,
      flightId: uuid.v4(),
      flightType,
      simulators: [
        {
          id: simulator,
          stations: [
            {
              userId,
              token: "assigned",
              name: "Crew",
              logs: [],
              badges: [mission]
            }
          ]
        }
      ]
    },
    refetchQueries: [
      {
        query: ME_QUERY,
        variables: { id: user && user.id }
      }
    ]
  });
  return (
    <div
      css={css`
        width: 90%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1em;
      `}
    >
      <div>
        <h2>Flight Type</h2>
        {flightTypes.map(f => (
          <Button
            block
            key={f.id}
            disabled={f.id === flightType}
            onClick={() => dispatch({ type: "setFlightType", value: f.id })}
          >
            {f.name}
          </Button>
        ))}
      </div>
      <div>
        <h2>Simulator</h2>
        {simulators.map(f => (
          <Button
            block
            key={f.id}
            disabled={f.id === simulator}
            onClick={() => dispatch({ type: "setSimulator", value: f.id })}
          >
            {f.name}
          </Button>
        ))}
      </div>
      <div>
        <h2>Mission</h2>
        {missions.map(f => (
          <Button
            block
            key={f.id}
            disabled={console.log(f.id, mission) || f.id === mission}
            onClick={() => dispatch({ type: "setMission", value: f.id })}
          >
            {f.name}
          </Button>
        ))}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Button
          disabled={!simulator || !flightType}
          onClick={() => {
            setLoading(true);
            createFlight().then(() => {
              dispatch({ type: "clear" });
              setLoading(false);
            });
          }}
        >
          Submit Flight
        </Button>
      )}
      {/* <div>
          <h2>Badges</h2>
          {badges.map(f => (
            <Button block key={f.id}>
              {f.name}
            </Button>
          ))}
        </div> */}
    </div>
  );
};
const FlightAssign = () => {
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qr, setQr] = useState(false);

  const [values, dispatch] = useReducer(pickerReducer, {});
  console.log("Values", values);
  const center = useContext(CenterContext);
  const client = useApolloClient();

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
        setUser(u => res.data.userGetRank);
        setQr(false);
      })
      .catch(err => {
        setLoading(false);
        return setError(err);
      });
  };
  const { data, loading: assignLoading } = useQuery(ASSIGN_QUERY, {
    variables: {
      centerId: center.id
    }
  });
  if (assignLoading) return <Loading animate />;
  return (
    <>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding-right: 20px;
        `}
      >
        <div>
          <h1>Flight Assign</h1>
          <p>Enter an email or confirmation code.</p>
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
      {user && (
        <div>
          <h2>Email: {user.email}</h2>
          <Picker
            userId={user.id}
            data={data}
            values={values}
            dispatch={dispatch}
          />
        </div>
      )}
    </>
  );
};

export default FlightAssign;