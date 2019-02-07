import React, { useState } from "react";
import { Input, Button, ImageUploader, Navigator } from "../../../components";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import css from "@emotion/css";
import { Mutation } from "react-apollo";
import CREATE_MISSION from "./createMission.graphql";
import { Loading } from "@arwes/arwes";

const EditMission = ({ create }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  return (
    <Navigator>
      {navigate => (
        <Mutation
          mutation={CREATE_MISSION}
          variables={{ name, description, image, type: "mission" }}
        >
          {(create, { loading }) =>
            loading ? (
              <Loading animate />
            ) : (
              <div>
                <h1>Create Mission</h1>
                <div
                  css={css`
                    label {
                      display: block;
                    }
                  `}
                >
                  <div>
                    <label>Name</label>
                    <Input
                      name="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <Input
                      name="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                  <div
                    css={css`
                      width: 200px;
                      height: 200px;
                      margin: 20px;
                    `}
                  >
                    <ImageUploader
                      noSave
                      onChange={image => {
                        setImage(dataURItoBlob(image));
                      }}
                    />
                  </div>
                  <Button
                    disabled={!name}
                    onClick={() =>
                      create().then(({ data: { missionCreate } }) =>
                        navigate(`/director/missions/${missionCreate.id}`)
                      )
                    }
                  >
                    Create Mission
                  </Button>
                </div>
              </div>
            )
          }
        </Mutation>
      )}
    </Navigator>
  );
};

export default EditMission;
