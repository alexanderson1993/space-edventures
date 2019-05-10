import React from "react";
import { withStyles } from "@arwes/arwes";
import css from "@emotion/css";

export default withStyles(() => {})(
  ({ style, theme, block, type, ...props }) => {
    const inputClass = css`
      color: ${theme.color.primary.base};
      margin: 0;
      height: 40px;
      border: none;
      cursor: pointer;
      display: inline-block;
      outline: none;
      font-size: 16.8px;
      box-shadow: none;
      font-family: Monaco, "Bitstream Vera Sans Mono", "Lucida Console",
        Terminal, monospace;
      line-height: 40px;
      padding-right: 10px;
      border-top: 1px solid ${theme.color.primary.base};
      border-bottom: 1px solid ${theme.color.primary.base};
      vertical-align: top;
      background-color: transparent;
    `;
    return (
      <div
        css={{
          display: block ? "block" : "inline-block",
          width: block ? "100%" : ""
        }}
      >
        <select css={inputClass} {...props} />;
      </div>
    );
  }
);
