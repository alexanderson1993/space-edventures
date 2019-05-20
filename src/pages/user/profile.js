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
  ImageUploader,
  Content
} from "../../components";
import "./profile.scss";
import ProfileContext from "../../helpers/profileContext";
import css from "@emotion/css";
import { Mutation } from "react-apollo";
import SET_PROFILE_PICTURE from "./setProfilePicture.graphql";
import UPDATE_PROFILE from "./updateProfile.graphql";
import UPDATE_TOKEN from "./updateToken.graphql";
import { dataURItoBlob } from "../../helpers/dataURIToBlob";
import { titleCase } from "change-case";
import randomName from "random-ship-names";
import useKonami from "react-konami-hook";

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
const Updater = ({ title, value, editMode }) => {
  const [newValue, setNewValue] = useState(value);
  const [pirate, setPirate] = useState(false);
  useKonami(() => setPirate(true));
  return !editMode ? (
    <h3>
      {titleCase(title)}: {newValue}
    </h3>
  ) : (
    <Mutation mutation={title === "token" ? UPDATE_TOKEN : UPDATE_PROFILE}>
      {action => (
        <FormGroup>
          <Label>
            {titleCase(title)}
            <Input
              block
              maxLength={title === "token" ? 12 : null}
              type="text"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              onBlur={e => {
                action({ variables: { [title]: e.target.value } });
              }}
            />
          </Label>
          {title === "displayName" && (
            <>
              <Button
                onClick={() => {
                  const name = randomName.civilian;
                  setNewValue(name);
                  action({ variables: { [title]: name } });
                }}
              >
                Random Display Name
              </Button>
              {pirate && (
                <Button
                  layer="alert"
                  onClick={() => {
                    const name = randomName.pirate;
                    setNewValue(name);
                    action({ variables: { [title]: name } });
                  }}
                >
                  Random Pirate Name
                </Button>
              )}
            </>
          )}
        </FormGroup>
      )}
    </Mutation>
  );
};
const Profile = () => {
  const { user } = useContext(ProfileContext);
  const [loadingPicture, setLoadingPicture] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPicture, setEditPicture] = useState(false);
  if (user)
    return user.loading ? (
      <Loading animate />
    ) : (
      <Content>
        <Container className="profile-page">
          <Header>
            <Words>Profile</Words>
          </Header>
          <ProfilePictureGrid>
            {loadingPicture ? (
              <Loading />
            ) : (
              <>
                <ProfilePicture />
                <Button onClick={() => setEditPicture(true)}>
                  Edit Profile Picture
                </Button>
              </>
            )}
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
            <Updater title={"token"} value={user.token} editMode={editMode} />
            <FormGroup>
              <Label>Rank</Label>
              <h3>{user.profile.rank && user.profile.rank.name}</h3>
              <div>Flight Hours: {user.profile.flightHours}</div>
              <div>Class Hours: {user.profile.classHours}</div>
            </FormGroup>
            <Link to="/user/certificate">
              <Button>View Rank Certificate</Button>
            </Link>
            <Button onClick={() => setEditMode(!editMode)}>
              {editMode ? "Done Editing" : "Edit Profile"}
            </Button>
          </UserData>
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
                      setLoadingPicture(true);
                      const picture = dataURItoBlob(image);
                      action({ variables: { picture } }).then(res => {
                        setLoadingPicture(false);
                      });
                    }}
                  />
                )}
              </Mutation>
            </div>
          </Modal>
        </Container>
      </Content>
    );
  return null;
};

export default Profile;
