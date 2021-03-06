import React from "react";
import ReactDOM from "react-dom";
import { Frame } from "@arwes/arwes";
import { css } from "@emotion/core";
import Button from "./Button";

export default ({
  label,
  subText,
  layer,
  show,
  onConfirm = () => {},
  onCancel = () => {}
}) => {
  return ReactDOM.createPortal(
    <div
      className="Arwes-root-0-1-1"
      css={css`
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, ${show ? 0.7 : 0});
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 25%;
        pointer-events: ${show ? "all" : "none"};
        opacity: ${show ? 1 : 0};
        transition: background-color 0.5s ease;
      `}
      onClick={onCancel}
    >
      <Frame animate show={show} level={2} corners={2} layer={layer}>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          css={css`
            padding: 20px;
          `}
        >
          <h3>{label}</h3>
          <h5>{subText}</h5>
          <div
            css={css`
              display: grid;
              grid-gap: 20px;
              grid-template-columns: 1fr auto auto;
            `}
          >
            <div />
            <Button layer="alert" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        </div>
      </Frame>
    </div>,
    document.body
  );
};
