import React from "react";
import ReactDOM from "react-dom";
import { Frame } from "@arwes/arwes";
import { css } from "@emotion/core";

export default ({ layer, show, children, onCancel = () => {} }) => {
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
            e.stopPropagation();
          }}
          css={css`
            padding: 20px;
          `}
        >
          {children}
        </div>
      </Frame>
    </div>,
    document.body
  );
};
