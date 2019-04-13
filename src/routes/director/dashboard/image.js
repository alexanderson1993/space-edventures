import React from "react";
import css from "@emotion/css";
import { ImageUploader, Image } from "../../../components";
import UPDATE_IMAGE from "./updateImage.graphql";
import CENTER_DIRECTOR from "../../../helpers/directorContext/centerDirector.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import { Spacer } from "./styles";

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
                <p>Please use a square transparent PNG.</p>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

export default ImageContainer;
