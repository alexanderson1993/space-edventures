import React from "react";
import styled from "@emotion/styled";
import { Words, Button, Input, Link } from "../../components";
import UserContext from "../../helpers/userContext";
import "./profile.scss";

const Container = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "header header"
    "profilePicture userData"
    "history history";
  grid-gap: 5%;
  margin-bottom: 10%;
`;
const Header = styled("h1")`
  grid-area: header;
`;
const ProfilePicture = styled("div")`
  grid-area: profilePicture;
`;
const UserData = styled("div")`
  grid-area: userData;
`;
const Label = styled("label")``;
const FormGroup = styled("div")``;
const History = styled("div")`
  grid-area: history;
`;
const Table = styled("table")`
  width: 100%;
`;

const Profile = () => {
  return (
    <UserContext.Consumer>
      {({ user }) =>
        user && (
          <Container className="profile-page">
            <Header>
              <Words>Profile</Words>
            </Header>
            <ProfilePicture>
              <img alt="profile" className="profile-image" src={user.profile} />
              <Button>Edit Profile Picture</Button>
            </ProfilePicture>
            <UserData>
              <FormGroup>
                <Label>
                  Name
                  <Input block type="text" defaultValue={user.name} />
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  Display Name
                  <Input block type="text" defaultValue={user.displayName} />
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>Rank</Label>
                <h3>{user.rank}</h3>
                <div>Flight Hours: {user.flightHours}</div>
                <div>Class Hours: {user.classHours}</div>
              </FormGroup>
              <Link to="/profile/certificate">
                <Button>View Rank Certificate</Button>
              </Link>
            </UserData>
            <History>
              <div>
                <h2>History</h2>

                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Center</th>
                      <th>Simulator</th>
                      <th>Station</th>
                      <th>Mission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.history.map(h => (
                      <tr key={h.id}>
                        <td>{h.date.toLocaleDateString()}</td>
                        <td>{h.center}</td>
                        <td>{h.simulator}</td>
                        <td>{h.station}</td>
                        <td>{h.mission}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </History>
          </Container>
        )
      }
    </UserContext.Consumer>
  );
};

export default Profile;
