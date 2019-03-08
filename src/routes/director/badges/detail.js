import React, { useState, useContext } from "react";
import { Input, Button, ImageUploader } from "../../../components";
import css from "@emotion/css";
import { Query, Mutation } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import BADGES_QUERY from "./badges.graphql";
import CHANGE_IMAGE from "./changeImage.graphql";
import CHANGE_DESCRIPTION from "./changeDescription.graphql";
import CHANGE_NAME from "./changeName.graphql";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import { Frame, Loading } from "@arwes/arwes";
import { CenterContext } from "../../../pages/director";

const BadgeComp = ({ badges, badgeId }) => {
  const center = useContext(CenterContext);
  const badge = badges.find(s => s.id === badgeId);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(
    badge ? badge.description : ""
  );
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(badge ? badge.name : "");
  if (!badge) return <h1>No badge found.</h1>;
  return (
    <div>
      <h1>Badge: {badge.name}</h1>
      {renaming ? (
        <Mutation
          mutation={CHANGE_NAME}
          variables={{ id: badge.id, name, centerId: center.id }}
        >
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
          variables={{ id: badge.id, description, centerId: center.id }}
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
        <div>{badge.description}</div>
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
                src={badge.image}
                onChange={image =>
                  action({
                    variables: {
                      id: badge.id,
                      image: dataURItoBlob(image),
                      centerId: center.id
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
const BadgeDetail = ({ badgeId }) => {
  const center = useContext(CenterContext);
  return (
    <Query query={BADGES_QUERY} variables={{ centerId: center.id }}>
      {graphQLHelper(({ badges }) => (
        <BadgeComp badges={badges} badgeId={badgeId} />
      ))}
    </Query>
  );
};

export default BadgeDetail;
