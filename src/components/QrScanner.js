import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import Webcam from "react-webcam";
import css from "@emotion/css";

function useAnimationFrame(callback) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the animation frame.
  useEffect(() => {
    let id;
    function tick() {
      savedCallback.current();
      id = requestAnimationFrame(tick);
    }
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
}

const QrScanner = ({ onCode }) => {
  const [error, setError] = useState(null);
  const canvasEl = useRef(document.createElement("canvas"));
  const dim = 480;
  canvasEl.current.width = dim;
  canvasEl.current.height = dim;
  const cam = useRef();
  const canvas = canvasEl.current.getContext("2d");
  useAnimationFrame(() => {
    if (cam.current) {
      canvas.drawImage(cam.current.video, 0, 0, dim, dim);
      const imageData = canvas.getImageData(0, 0, dim, dim);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        onCode && onCode(code);
      }
    }
  });
  const videoConstraints = {
    frameRate: 15,
    facingMode: "environment"
  };
  return (
    <div>
      {error ? (
        <h2>Error Accessing Webcam: {error.message}</h2>
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
          `}
        >
          <Webcam
            ref={cam}
            style={{ width: "100%", maxWidth: "480px", borderRadius: "40px" }}
            width={dim}
            height={dim}
            audio={false}
            screenshotWidth={dim}
            onUserMediaError={err => setError(err)}
            videoConstraints={videoConstraints}
          />
          <p>Position the QR code inside of the frame.</p>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
