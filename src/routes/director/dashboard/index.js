import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { DirectorContext } from "../../../helpers/directorContext";
import { Button, ImageUploader, Input } from "../../../components";
import UPDATE_NAME from "./updateName.graphql";
import UPDATE_DESCRIPTION from "./updateDescription.graphql";
import UPDATE_WEBSITE from "./updateWebsite.graphql";
import UPDATE_IMAGE from "./updateImage.graphql";
import CENTER_DIRECTOR from "../centerDirector.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";

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
          <div
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
          </div>
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
          <>
            <h3>Description</h3>
            {editMode && editingDescription ? (
              <Input
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
          </>
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
          <>
            <h3>Website</h3>
            {editMode && editingWebsite ? (
              <Input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
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
          </>
        )
      }
    </Mutation>
  );
};

const Image = ({ id, name, imageUrl, editMode }) => {
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
          <>
            <h3>Image</h3>

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
          </>
        )
      }
    </Mutation>
  );
};

const Dashboard = () => {
  const {
    director: { center = {} }
  } = useContext(DirectorContext);
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <div
        css={css`
          float: right;
        `}
      />
      <Name {...center} editMode={editMode} />
      <Button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Done Editing" : "Edit"}
      </Button>
      <Description {...center} editMode={editMode} />
      <Image {...center} editMode={editMode} />
      <Website {...center} editMode={editMode} />
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
    </>
  );
};

export default Dashboard;
