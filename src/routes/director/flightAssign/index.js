import React, { lazy, useState, useContext, Suspense, useReducer } from "react";
import { Input, Button, Words } from "../../../components";
import { Blockquote, Loading } from "@arwes/arwes";
import { FaBan } from "react-icons/fa";
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
    return { flights: state.flights };
  }
  if (action.type === "clearAll") {
    return { flights: [] };
  }
  if (action.type === "remove") {
    return { ...state, flights: state.flights.filter(i => i.id !== action.id) };
  }
  if (action.type === "add") {
    const output = {
      flights: [
        ...(state.flights || []),
        {
          id: uuid.v4(),
          simulator: state.simulator,
          mission: state.mission,
          flightType: state.flightType
        }
      ]
    };
    console.log(output);
    return output;
  }
};

function nameSort(a, b) {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}
const Picker = ({ userId, email, data, values, dispatch }) => {
  const { user } = useContext(AuthContext);
  const { simulators, missions, /*badges,*/ flightTypes } = data;
  const { simulator, mission, flightType, flights } = values;
  const [loading, setLoading] = useState(false);
  const center = useContext(CenterContext);
  const createFlight = useMutation(CREATE_FLIGHT, {
    variables: {
      centerId: center.id,
      flightRecords: flights.map(f => ({
        flightId: uuid.v4(),
        flightTypeId: f.flightType,
        simulators: [
          {
            id: f.simulator,
            stations: [
              {
                userId,
                email,
                token: "assigned",
                name: "Crew",
                logs: [],
                badges: [f.mission]
              }
            ]
          }
        ]
      }))
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
        {flightTypes.sort(nameSort).map(f => (
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
        {simulators.sort(nameSort).map(f => (
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
        {missions
          .filter(
            m =>
              m.simulators.length === 0 ||
              m.simulators.find(s => s.id === simulator)
          )
          .sort(nameSort)
          .map(f => (
            <Button
              block
              key={f.id}
              disabled={f.id === mission}
              onClick={() => dispatch({ type: "setMission", value: f.id })}
            >
              {f.name}
            </Button>
          ))}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Button
            block
            disabled={!simulator || !flightType}
            onClick={() => dispatch({ type: "add" })}
          >
            Add Flight
          </Button>
          <div
            css={css`
              max-height: 50vh;
              overflow-y: auto;
            `}
          >
            {flights.map(f => (
              <div key={f.id}>
                <strong>
                  {flightTypes.find(t => t.id === f.flightType).name}
                </strong>
                <FaBan
                  css={css`
                    color: red;
                  `}
                  onClick={() => dispatch({ type: "remove", id: f.id })}
                />
                <div>
                  {simulators.find(t => t.id === f.simulator).name}:{" "}
                  {missions.find(t => t.id === f.mission).name}
                </div>
              </div>
            ))}
          </div>
          <Button
            block
            disabled={flights.length === 0}
            onClick={() => {
              setLoading(true);
              createFlight().then(() => {
                dispatch({ type: "clearAll" });
                setLoading(false);
              });
            }}
          >
            Submit Flights
          </Button>
        </div>
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

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const FlightAssign = () => {
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qr, setQr] = useState(false);

  const [values, dispatch] = useReducer(pickerReducer, { flights: [] });
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
        if (
          err.message.indexOf("No user exists with") > -1 &&
          validateEmail(token)
        ) {
          return setUser({ id: null, email: token });
        }
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
          <p>Enter an email or officer code.</p>
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
            email={user.email}
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
