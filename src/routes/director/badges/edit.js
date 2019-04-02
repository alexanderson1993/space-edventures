import React, { useState, useContext } from "react";
import { Input, Button, ImageUploader, Navigator } from "../../../components";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import css from "@emotion/css";
import { Mutation } from "react-apollo";
import CREATE_BADGE from "./createBadge.graphql";
import BADGES_QUERY from "./badges.graphql";
import { Loading } from "@arwes/arwes";
import { CenterContext } from "../../../pages/director";

const EditBadge = ({ create }) => {
  const center = useContext(CenterContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  return (
    <Navigator>
      {navigate => (
        <Mutation
          mutation={CREATE_BADGE}
          variables={{
            name,
            description,
            image,
            type: "badge",
            centerId: center.id
          }}
          update={(cache, { data: { badgeCreate } }) => {
            const { badges } = cache.readQuery({
              query: BADGES_QUERY,
              variables: { centerId: center.id }
            });
            cache.writeQuery({
              query: BADGES_QUERY,
              variables: { centerId: center.id },
              data: { badges: badges.concat([badgeCreate]) }
            });
          }}
        >
          {(create, { loading }) =>
            loading ? (
              <Loading animate />
            ) : (
              <div>
                <h1>Create Badge</h1>
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
                      create().then(({ data: { badgeCreate } }) =>
                        navigate(
                          `/director/${center.id}/badges/${badgeCreate.id}`
                        )
                      )
                    }
                  >
                    Create Badge
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

export default EditBadge;
