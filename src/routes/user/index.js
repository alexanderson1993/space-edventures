import React, { useContext } from "react";
import ProfileContext from "../../helpers/profileContext";
import { Content, Button, Link, Words, ProfilePicture } from "../../components";
import lazy from "../../helpers/lazy";
import css from "@emotion/css";
import styled from "@emotion/styled";
import { Frame } from "@arwes/arwes";
import Rank from "./rank";
import OfficerLog from "./logs";
const MapComponent = lazy(() => import("./map"));
const RecentFlight = lazy(() => import("./recentFlight"));

const ContentFrame = styled(Frame)`
  height: 100%;
  width: 100%;
  & > div:last-child {
    height: 100%;
    padding: 0.4em;

    & > div {
      height: 100%;
    }
  }
`;
const ProfileBox = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  grid-template-rows: 1fr 1fr;
  grid-auto-rows: auto;
  gap: 1em;
  width: 100%;
  min-height: calc(100vh - 400px);
`;

const ContentBox = ({ title, className, action, callToAction, children }) => {
  return (
    <ContentFrame animate={true} level={3} corners={4} className={className}>
      <div
        css={css`
          height: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <h2
          css={css`
            text-align: center;
          `}
        >
          <Words>{title}</Words>
        </h2>
        <div
          css={css`
            flex: 1;
          `}
        >
          {children}
        </div>
        {action &&
          callToAction &&
          (typeof action === "string" ? (
            <Link to={action}>
              <Button block>{callToAction}</Button>
            </Link>
          ) : (
            <Button action={action} block>
              {callToAction}
            </Button>
          ))}
      </div>
    </ContentFrame>
  );
};

const UserPage = () => {
  const { user } = useContext(ProfileContext);
  return (
    <Content>
      <h1>
        Welcome,{" "}
        {user.profile
          ? user.profile.displayName || user.profile.name
          : user.email}
      </h1>

      <ProfileBox>
        <ContentBox
          title="My Profile"
          callToAction="Go To Profile"
          action={"/user/profile"}
        >
          <div
            css={css`
              width: 33%;
              float: left;
              margin-right: 20px;
            `}
          >
            <ProfilePicture />
          </div>
          <div
            css={css`
              flex: 2;
              p {
                margin-bottom: 0.5em;
              }
            `}
          >
            <p>{user.profile.displayName || user.profile.name}</p>
            <p>{user.profile.rank && user.profile.rank.name}</p>
            <p>Confirmation Code: {user.token}</p>
          </div>
        </ContentBox>
        <ContentBox
          title="My Flights"
          css={css`
            grid-column: span 2;
          `}
          callToAction="See All Flights"
          action="/user/flights"
        >
          <RecentFlight />
        </ContentBox>
        <ContentBox
          title="My Rank"
          callToAction="See All Ranks"
          action="/ranks"
        >
          <Rank />
        </ContentBox>
        {/* <ContentBox title="Recommended Missions" /> */}
        {/* <ContentBox
          title="Track Your Progress"
          callToAction="See Progress Details"
          action="/user/flights"
        /> */}
        <ContentBox
          title="Space Center Map"
          css={css`
            grid-column: span 2;
            grid-row: span 2;
          `}
        >
          <MapComponent />
        </ContentBox>
        <ContentBox
          title="Officer Log Entries"
          callToAction="See All Entries"
          action="/user/officerLog"
        >
          <OfficerLog />
        </ContentBox>
      </ProfileBox>
    </Content>
  );
};
export default UserPage;
