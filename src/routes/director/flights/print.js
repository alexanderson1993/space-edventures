import React, { useContext } from "react";
import useQrCode from "react-qrcode-hook";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import GET_FLIGHT from "./getFlight.graphql";
import Printable from "../../../helpers/printable";
import css from "@emotion/css";
import { Button } from "../../../components";
import { CenterContext } from "../../../pages/director";

const Flyer = ({
  date,
  simulator,
  flightType,
  station: { name, badges, token, userId }
}) => {
  const qrCode = useQrCode(`https://spaceedventures.org/redeem?token=${token}`);
  // If there is a UserId already, no need to print a flyer.
  if (userId) return null;
  const mission = badges.find(b => b.type === "mission");
  return (
    <div
      css={css`
        box-sizing: border-box;
        width: 50%;
        height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        float: left;
        border: dashed 1px black;
        padding: 10px;
        page-break-inside: avoid;
        break-inside: avoid;
        background-color: white;
        @media screen {
          min-height: 500px;
        }
      `}
    >
      <p>
        This signifies that on {new Date(date).toLocaleDateString()} you
        completed the following flight:
      </p>
      <h4>{flightType.name}</h4>
      <p>
        earning{" "}
        <strong>
          {flightType.flightHours} Flight and
          {flightType.classHours} Class Hours
        </strong>{" "}
        on the following simulator and station:
      </p>
      <h3>
        {simulator.name} - {name}
      </h3>
      {mission && (
        <>
          <p>
            And completed the mission{" "}
            <strong>
              <em>{mission.name}</em>
            </strong>
          </p>
        </>
      )}
      <p>
        Add this flight to your rank by going to{" "}
        <u>https://spaceedventures.org/redeem</u> and typing in the following
        redemption code or scanning the QR code:
      </p>
      <div
        css={css`
          display: flex;
          justify-content: space-around;
          align-items: center;
        `}
      >
        <h2>{token}</h2>
        <img src={qrCode} alt="qr code" />
      </div>
    </div>
  );
};

const Print = ({ id }) => {
  const center = useContext(CenterContext);
  return (
    <div>
      <Button
        onClick={() => {
          window.print();
        }}
      >
        Print
      </Button>
      <Printable preview>
        <Query query={GET_FLIGHT} variables={{ id, centerId: center.id }}>
          {graphQLHelper(({ flightRecord }) => (
            <div
              css={css`
                width: 100%;
                background-color: white;
                color: black;

                * {
                  color: black;
                }
                p {
                  margin: 0;
                }
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                  margin: 0;
                  margin-top: 5px;
                  margin-bottom: 5px;
                  color: black;
                  text-align: center;
                }
              `}
            >
              {flightRecord.simulators.map(s =>
                s.stations.map(t => (
                  <Flyer
                    simulator={s}
                    station={t}
                    flightType={flightRecord.flightType}
                    date={flightRecord.date}
                  />
                ))
              )}
            </div>
          ))}
        </Query>
      </Printable>
    </div>
  );
};

export default Print;
