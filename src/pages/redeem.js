import React, { useState, Suspense, useEffect, useContext } from "react";
import { Content, Button, Input, Words } from "../components";
import queryString from "query-string";
import { Mutation } from "react-apollo";
import REDEEM_FLIGHT from "../queries/redeemFlight.graphql";
import { Loading, Blockquote } from "@arwes/arwes";
import { navigate } from "gatsby";
import ProfileContext from "../helpers/profileContext";
import ME_QUERY from "../queries/me.graphql";

const QrScanner = React.lazy(() => import("../components/QrScanner"));

const Redeem = ({ location }) => {
  const { user } = useContext(ProfileContext);
  useEffect(() => {
    if (!user.loading && !user.id) {
      typeof window !== "undefined" &&
        window.sessionStorage.setItem("postLoginPath", "/redeem");
      navigate("/accounts/login");
    }
  }, [user]);

  const { token = "" } = queryString.parse(location.search);

  const [showScanner, setShowScanner] = useState(false);
  const [code, setCode] = useState(token);
  return (
    <Mutation
      mutation={REDEEM_FLIGHT}
      variables={{ token: code }}
      refetchQueries={[
        {
          query: ME_QUERY,
          variables: { id: user && user.id }
        }
      ]}
    >
      {(action, { loading, error, data }) => {
        if (loading)
          return (
            <Content>
              <Loading animate />
              <h3>
                <Words>Redeeming Flight...</Words>
              </h3>
            </Content>
          );
        if (data) {
          const mission =
            data.flightClaim.badges &&
            data.flightClaim.badges.find(b => b.type === "mission");
          const badges =
            data.flightClaim.badges &&
            data.flightClaim.badges.filter(b => b.type !== "mission");
          return (
            <Content>
              <h1>
                <Words>Flight Redemption Successful!</Words>
              </h1>
              <p>
                Here's the details for your flight:
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(data.flightClaim.date).toDateString()}
                </p>
                <p>
                  <strong>Center:</strong>{" "}
                  {data.flightClaim.flightRecord.center.name}
                </p>
                <p>
                  <strong>Flight Type:</strong>{" "}
                  {data.flightClaim.flightRecord.flightType.name} (
                  {data.flightClaim.flightRecord.flightType.flightHours} Flight
                  Hours, {data.flightClaim.flightRecord.flightType.classHours}{" "}
                  Class Hours)
                </p>
                <p>
                  <strong>Simulator:</strong> {data.flightClaim.simulator.name}
                </p>
                <p>
                  <strong>Station:</strong> {data.flightClaim.stationName}
                </p>
                {mission && (
                  <p>
                    <strong>Mission:</strong> {mission.name}
                  </p>
                )}
                {badges && badges.length > 0 && (
                  <div>
                    <strong>Badges:</strong>
                    <ul>
                      {badges.map(b => (
                        <li key={b.id}>{b.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </p>
            </Content>
          );
        }
        return (
          <Content>
            <h1>Redeem Flight</h1>
            <p>To redeem your flight, enter your redemption code.</p>
            <Input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <div>
              <Button onClick={action}>Submit</Button>
              {error && (
                <Blockquote>
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </div>
            <p>If you have a QR code, you can scan it.</p>
            {showScanner ? (
              <Suspense fallback={<p>Loading QR Scanner...</p>}>
                <QrScanner
                  onCode={code => {
                    setCode(
                      code.data.replace(
                        "https://spaceedventures.org/redeem?token=",
                        ""
                      )
                    );
                    setShowScanner(false);
                  }}
                />
              </Suspense>
            ) : (
              <Button onClick={() => setShowScanner(true)}>Scan QR Code</Button>
            )}
          </Content>
        );
      }}
    </Mutation>
  );
};
export default Redeem;
