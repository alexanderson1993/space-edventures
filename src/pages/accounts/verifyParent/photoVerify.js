import React, { useState } from "react";
import { Button, ImageUploader, Center, Words } from "../../../components";
import { dataURItoBlob } from "../../../helpers/dataURIToBlob";
import styled from "@emotion/styled";
import css from "@emotion/css";
import PHOTO_VERIFY from "./setPhotosVerify.graphql";
import { Mutation } from "react-apollo";
import { Loading, Blockquote } from "@arwes/arwes";

const ImageBox = styled("div")`
  width: 300px;
  height: 400px;
  margin-bottom: 50px;
  border: solid 1px rgba(255, 255, 255, 0.5);
`;
const PhotoVerify = ({
  back,
  user: {
    id,
    verification: { idPhotoUrl, parentPhotoUrl }
  }
}) => {
  const [photoId, setPhotoId] = useState(null);
  const [photo, setPhoto] = useState(null);
  return (
    <div>
      <div>
        <Button onClick={back}>Go Back</Button>
      </div>
      <h2>Photo Verification</h2>
      <p>
        <strong>Instructions:</strong> Upload a recent photo of yourself and a
        photo or scan of your photo ID. This could be a government issued ID,
        drivers license, or passport. One of our staff members will verify your
        photo ID with the photo you provide to confirm that your identity. The
        photos will be deleted after verification.
      </p>
      <Mutation mutation={PHOTO_VERIFY} variables={{ id, photo, photoId }}>
        {(action, { loading, error, data }) => {
          if (loading)
            return (
              <Center>
                <Loading animate />
                <p>Uploading Photos...</p>
              </Center>
            );
          if (
            (idPhotoUrl && parentPhotoUrl) ||
            (data && data.verifyWithPhotos)
          ) {
            return (
              <div>
                <p>
                  <Words>Verification Successful</Words>
                </p>
                <Button block layer="success" onClick={back}>
                  Go Back
                </Button>
              </div>
            );
          }

          return (
            <>
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  width: 100%;
                `}
              >
                <div>
                  <h3>Recent Photo</h3>
                  <ImageBox>
                    <ImageUploader
                      noSave
                      noCrop
                      onChange={image => {
                        const picture = dataURItoBlob(image);
                        setPhoto(picture);
                      }}
                    />
                  </ImageBox>
                </div>
                <div>
                  <h3>Photo ID</h3>
                  <ImageBox>
                    <ImageUploader
                      noSave
                      noCrop
                      onChange={image => {
                        const picture = dataURItoBlob(image);
                        setPhotoId(picture);
                      }}
                    />
                  </ImageBox>
                </div>
              </div>
              <Button disabled={!photoId || !photo} onClick={action}>
                Submit Images
              </Button>
              {error && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </>
          );
        }}
      </Mutation>
    </div>
  );
};
export default PhotoVerify;
