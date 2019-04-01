import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { Button, ImageUploader, Input, Auth, Image } from "../../../components";
import UPDATE_NAME from "./updateName.graphql";
import UPDATE_DESCRIPTION from "./updateDescription.graphql";
import UPDATE_WEBSITE from "./updateWebsite.graphql";
import UPDATE_IMAGE from "./updateImage.graphql";
import CENTER_DIRECTOR from "../../../helpers/directorContext/centerDirector.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import { CenterContext } from "../../../pages/director";

// const Badge = styled("div")`
//   width: 100%;
//   background-color: #1b9493;
//   display: flex;
//   padding: 20px;
//   margin-bottom: 10px;
// `;

// const Mission = styled(Badge)`
//   background-color: #1b3d94;
// `;
const Spacer = styled("div")`
  margin-bottom: 2em;
`;
const Highlight = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Num = styled("p")`
  font-family: "Electrolize", "sans-serif";
  font-size: 40px;
  font-weight: 800;
`;

const Name = ({ name: centerName, id, editMode }) => {
  const [name, setName] = useState(centerName);
  const [editingName, setEditingName] = useState(false);
  return (
    <Mutation mutation={UPDATE_NAME} variables={{ centerId: id, name }}>
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer
            css={css`
              display: flex;
              align-items: baseline;
            `}
          >
            {editMode && editingName ? (
              <Input value={name} onChange={e => setName(e.target.value)} />
            ) : (
              <h1>{name}</h1>
            )}
            {editMode && (
              <div>
                <Button
                  onClick={() =>
                    editingName
                      ? action().then(() => setEditingName(false))
                      : setEditingName(true)
                  }
                >
                  Update Name
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};
const Description = ({ editMode, description: centerDescription, id }) => {
  const [description, setDescription] = useState(centerDescription);
  const [editingDescription, setEditingDescription] = useState(false);
  return (
    <Mutation
      mutation={UPDATE_DESCRIPTION}
      variables={{ centerId: id, description }}
    >
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer>
            <h3>Description</h3>
            {editMode && editingDescription ? (
              <Input
                block
                type="textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            ) : (
              <p>{description}</p>
            )}
            {editMode && (
              <div>
                <Button
                  onClick={() =>
                    editingDescription
                      ? action().then(() => setEditingDescription(false))
                      : setEditingDescription(true)
                  }
                >
                  Update Description
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};
const Website = ({ id, website: centerWebsite, editMode }) => {
  const [website, setWebsite] = useState(centerWebsite);
  const [editingWebsite, setEditingWebsite] = useState(false);
  return (
    <Mutation mutation={UPDATE_WEBSITE} variables={{ centerId: id, website }}>
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer>
            <h3>Website</h3>
            {editMode && editingWebsite ? (
              <>
                <Input
                  block
                  type="url"
                  value={website}
                  placeholder="https://spaceedventures.org"
                  onChange={e => setWebsite(e.target.value)}
                />
                <small>
                  Make sure you include <code>http://</code>
                </small>
              </>
            ) : (
              <a href={website} target="_blank" rel="noopener noreferrer">
                {website}
              </a>
            )}
            {editMode && (
              <div>
                <Button
                  onClick={() =>
                    editingWebsite
                      ? action().then(() => setEditingWebsite(false))
                      : setEditingWebsite(true)
                  }
                >
                  Update Website
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

const ImageContainer = ({ id, name, imageUrl, editMode }) => {
  return (
    <Mutation
      mutation={UPDATE_IMAGE}
      update={(cache, { data: { centerUpdateImage } }) => {
        const { me } = cache.readQuery({ query: CENTER_DIRECTOR });
        cache.writeQuery({
          query: CENTER_DIRECTOR,
          data: {
            me: {
              ...me,
              center: { ...me.center, imageUrl: centerUpdateImage.imageUrl }
            }
          }
        });
      }}
    >
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer>
            <h3>Image</h3>

            {/* If they are not in edit mode */}
            {!editMode && imageUrl && (
              <div
                css={css`
                  width: 300px;
                  height: 300px;
                `}
              >
                <Image src={imageUrl} alt={name} />
              </div>
            )}

            {/* If they are in edit mode */}
            {editMode && (
              <div
                css={css`
                  width: 300px;
                  height: 300px;
                `}
              >
                <ImageUploader
                  src={imageUrl}
                  alt={name}
                  onChange={image => {
                    const picture = dataURItoBlob(image);

                    action({ variables: { centerId: id, image: picture } });
                  }}
                />
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

const Dashboard = () => {
  const center = useContext(CenterContext);
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Auth roles={["director"]}>
        <Button
          css={css`
            float: right;
            margin-right: 20px;
          `}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done Editing" : "Edit"}
        </Button>
      </Auth>
      <Name {...center} editMode={editMode} />
      <div
        css={css`
          margin-top: 60px;
        `}
      >
        <h2>Statistics</h2>
        <div
          css={css`
            display: flex;
            justify-content: space-around;
          `}
        >
          <Highlight>
            <Num>{center.simulatorCount}</Num>
            <p>Simulators</p>
          </Highlight>
          <Highlight>
            <Num>{center.missionCount}</Num>
            <p>Missions</p>
          </Highlight>
          <Highlight>
            <Num>{center.badgeCount}</Num>
            <p>Badges</p>
          </Highlight>
          <Highlight>
            <Num>{center.flightRecordCount}</Num>
            <p>Flights</p>
          </Highlight>
        </div>
      </div>
      <Description {...center} editMode={editMode} />
      <ImageContainer {...center} editMode={editMode} />
      <Website {...center} editMode={editMode} />
    </>
  );
};

export default Dashboard;
