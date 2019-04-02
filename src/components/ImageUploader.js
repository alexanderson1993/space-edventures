import React, { Suspense, useState, useRef, useCallback } from "react";
import { css } from "@emotion/core";
import { Loading } from "@arwes/arwes";
import { Button } from ".";
import "react-image-crop/dist/ReactCrop.css";
// For lazy loading.
const loadImagePromise = import("blueimp-load-image");
const ReactCrop = React.lazy(() => import("react-image-crop"));

const ImageUploader = ({ src, onChange = () => {}, noSave, noCrop }) => {
  const cropDefault = {
    aspect: 1
  };
  const imgRef = useRef(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  // We store the state twice so we can crop the image using with the original image
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropping, setCropping] = useState(false);

  // ReactCrop stores cropping information in two ways, so we have to store both.
  const [crop, setCrop] = useState(cropDefault);
  const [pixelCrop, setPixelCrop] = useState(null);

  // Load the image using the load-image package
  const doImageLoad = async file => {
    // Lazy-load the load-image function.
    const { default: loadImage } = await loadImagePromise;
    loadImage(file, img => {
      const width = 1000;
      const scaleFactor = width / img.width;
      const aspectRatio = img.width / img.height;
      // It provides the image as a <img> element - convert it to dataURL
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = img.height * scaleFactor;
      var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, width, img.height * scaleFactor);
      var dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);

      // Do a pre-crop
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = width;
      cropCanvas.height = width;
      const ctx = cropCanvas.getContext("2d");
      if (aspectRatio > 1) {
        ctx.drawImage(
          img,
          0,
          0,
          img.width / aspectRatio,
          img.height,
          0,
          0,
          width,
          width
        );
      } else {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height * aspectRatio,
          0,
          0,
          width,
          width
        );
      }
      const image = cropCanvas.toDataURL("image/jpeg");
      setCroppedImage(image);

      setCropping(false);
      setCrop(cropDefault);
      noSave && onChange(image);
    });
  };

  const handleLoad = e => {
    const file = e.target.files[0];

    doImageLoad(file);
  };

  const finishCrop = () => {
    if (!pixelCrop) return;
    // Plop the image onto a canvas with the cropping parameters
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imgRef.current,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    const image = canvas.toDataURL("image/jpeg");
    setCroppedImage(image);
    noSave && onChange(image);
  };

  const [height, setHeight] = useState(0);

  const imageRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      {image || src ? (
        <div
          ref={imageRef}
          css={css`
            flex: 1;
            display: flex;
            justify-content: center;
          `}
        >
          {cropping ? (
            // Suspense for lazy-loading the react-crop component
            <Suspense fallback={<Loading animate />}>
              <ReactCrop
                src={image}
                crop={crop}
                onChange={crop => setCrop(crop)}
                onImageLoaded={img => (imgRef.current = img)}
                onComplete={(_, pixelCrop) => setPixelCrop(pixelCrop)}
              />
            </Suspense>
          ) : (
            <img
              css={{
                objectFit: "contain",
                height: height
              }}
              src={croppedImage || image || src}
              alt="uploaded"
            />
          )}
        </div>
      ) : (
        <p
          css={css`
            flex: 1;
            text-align: center;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          No Image Loaded
        </p>
      )}
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        {cropping && (
          <Button
            type="button"
            block
            onClick={() => {
              setCropping(!cropping);
            }}
          >
            Cancel Crop
          </Button>
        )}
        {!noCrop && image && (
          <Button
            type="button"
            block
            onClick={() => {
              setCropping(!cropping);
              if (cropping) {
                finishCrop();
              }
            }}
          >
            Crop Image
          </Button>
        )}

        {!cropping && (
          <label htmlFor="image-file-upload">
            <Button
              type="button"
              block
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Choose Image
            </Button>
            <input
              hidden
              ref={fileRef}
              accept="image/*"
              type="file"
              onChange={handleLoad}
            />
          </label>
        )}
        {!cropping && (image || croppedImage) && !noSave && (
          <Button
            type="button"
            block
            onClick={() => onChange(croppedImage || image)}
          >
            Save Image
          </Button>
        )}
      </div>
    </div>
  );
};
export default ImageUploader;
