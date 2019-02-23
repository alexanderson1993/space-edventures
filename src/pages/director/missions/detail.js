import React, { useState } from "react";
import { Input, Button, ImageUploader } from "../../../components";
import css from "@emotion/css";
import { Query, Mutation } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import MISSIONS_QUERY from "./missions.graphql";
import CHANGE_IMAGE from "./changeImage.graphql";
import CHANGE_DESCRIPTION from "./changeDescription.graphql";
import CHANGE_NAME from "./changeName.graphql";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import { Frame, Loading } from "@arwes/arwes";

const MissionsComp = ({ missionId, missions }) => {
  const mission = missions.find(s => s.id === missionId);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(
    mission ? mission.description : ""
  );
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(mission ? mission.name : "");
  if (!mission) return <h1>No mission found.</h1>;
  return (
    <div>
      <h1>Mission: {mission.name}</h1>
      {renaming ? (
        <Mutation mutation={CHANGE_NAME} variables={{ id: mission.id, name }}>
          {(action, { loading }) =>
            loading ? (
              <Loading animate />
            ) : (
              <div>
                <Input value={name} onChange={e => setName(e.target.value)} />
                <div>
                  <Button onClick={() => setRenaming(false)}>Cancel</Button>{" "}
                  <Button
                    onClick={() => action().then(() => setRenaming(false))}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )
          }
        </Mutation>
      ) : (
        <Button onClick={() => setRenaming(true)}>Rename</Button>
      )}
      <div>
        <h2>Description:</h2>
      </div>
      {editingDescription ? (
        <Mutation
          mutation={CHANGE_DESCRIPTION}
          variables={{ id: mission.id, description }}
        >
          {(action, { loading }) =>
            loading ? (
              <Loading animate />
            ) : (
              <div>
                <Input
                  css={css`
                    width: 500px;
                    height: 350px;
                  `}
                  type="textarea"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div>
                  <Button onClick={() => setEditingDescription(false)}>
                    Cancel
                  </Button>{" "}
                  <Button
                    onClick={() =>
                      action().then(() => setEditingDescription(false))
                    }
                  >
                    Save
                  </Button>
                </div>
              </div>
            )
          }
        </Mutation>
      ) : (
        <div>{mission.description}</div>
      )}
      {!editingDescription && (
        <Button onClick={() => setEditingDescription(true)}>
          Edit Description
        </Button>
      )}
      <div
        css={css`
          width: 300px;
          height: 300px;
        `}
      >
        <h2>Image:</h2>
        <Mutation mutation={CHANGE_IMAGE}>
          {action => (
            <Frame>
              <ImageUploader
                noSave
                src={mission.image}
                onChange={image =>
                  action({
                    variables: {
                      id: mission.id,
                      image: dataURItoBlob(image)
                    }
                  })
                }
              />
            </Frame>
          )}
        </Mutation>
      </div>
    </div>
  );
};
const MissionDetail = ({ missionId }) => {
  return (
    <Query query={MISSIONS_QUERY}>
      {graphQLHelper(({ missions }) => (
        <MissionsComp missionId={missionId} missions={missions} />
      ))}
    </Query>
  );
};

export default MissionDetail;
