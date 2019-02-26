import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import { Loading } from "@arwes/arwes";
import {
  Words,
  Button,
  Input,
  Link,
  ProfilePicture,
  Modal,
  ImageUploader
} from "../../components";
import "./profile.scss";
import ProfileContext from "../../helpers/profileContext";
import css from "@emotion/css";
import { Mutation } from "react-apollo";
import SET_PROFILE_PICTURE from "./setProfilePicture.graphql";
import UPDATE_PROFILE from "./updateProfile.graphql";
import { dataURItoBlob } from "../../helpers/dataURIToBlob";
import { titleCase } from "change-case";

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
const ProfilePictureGrid = styled("div")`
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

const Updater = ({ title, value, editMode }) => {
  const [newValue, setNewValue] = useState(value);
  return !editMode ? (
    <h3>
      {titleCase(title)}: {newValue}
    </h3>
  ) : (
    <Mutation mutation={UPDATE_PROFILE}>
      {action => (
        <FormGroup>
          <Label>
            {titleCase(title)}
            <Input
              block
              type="text"
              defaultValue={value}
              onBlur={e => {
                setNewValue(e.target.value);
                action({ variables: { [title]: e.target.value } });
              }}
            />
          </Label>
        </FormGroup>
      )}
    </Mutation>
  );
};
const Profile = () => {
  const { user } = useContext(ProfileContext);
  const [editMode, setEditMode] = useState(false);
  const [editPicture, setEditPicture] = useState(false);
  console.log(user);
  if (user)
    return user.loading ? (
      <Loading animate />
    ) : (
      <Container className="profile-page">
        <Header>
          <Words>Profile</Words>
        </Header>
        <ProfilePictureGrid>
          <ProfilePicture />
          <Button onClick={() => setEditPicture(true)}>
            Edit Profile Picture
          </Button>
        </ProfilePictureGrid>
        <UserData>
          <Updater
            title={"name"}
            value={user.profile.name}
            editMode={editMode}
          />
          <Updater
            title={"displayName"}
            value={user.profile.displayName}
            editMode={editMode}
          />
          <FormGroup>
            <Label>Rank</Label>
            <h3>{user.rank}</h3>
            <div>Flight Hours: {user.flightHours}</div>
            <div>Class Hours: {user.classHours}</div>
          </FormGroup>
          <Link to="/profile/certificate">
            <Button>View Rank Certificate</Button>
          </Link>
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Done Editing" : "Edit Profile"}
          </Button>
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
                {/* {user.history.map(h => (
                <tr key={h.id}>
                  <td>{h.date.toLocaleDateString()}</td>
                  <td>{h.center}</td>
                  <td>{h.simulator}</td>
                  <td>{h.station}</td>
                  <td>{h.mission}</td>
                </tr>
              ))} */}
              </tbody>
            </Table>
          </div>
        </History>
        <Modal show={editPicture} onCancel={() => setEditPicture(false)}>
          <div
            css={css`
              width: 600px;
              height: 600px;
              max-height: 800vh;
              max-width: 80vw;
            `}
          >
            <Mutation mutation={SET_PROFILE_PICTURE}>
              {action => (
                <ImageUploader
                  onChange={image => {
                    setEditPicture(false);
                    const picture = dataURItoBlob(image);
                    action({ variables: { picture } });
                  }}
                />
              )}
            </Mutation>
          </div>
        </Modal>
      </Container>
    );
  return null;
};

export default Profile;
