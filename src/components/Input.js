import React from "react";
import { Frame, withStyles } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";
import css from "@emotion/css";

export default withStyles(() => {})(
  ({ style, theme, block, type, ...props }) => {
    const inputClass = css`
      color: ${theme.color.primary.base};
      background: transparent;
      border: transparent;
      padding: 5px 10px;
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      width: 100%;
    `;
    return (
      <AnimateContext.Consumer>
        {({ show }) => (
          <div style={{ display: block ? "block" : "inline-block" }}>
            <Frame animate show={show} level={2} corners={2} {...props}>
              {(() => {
                if (type === "textarea")
                  return (
                    <textarea css={inputClass} {...props}>
                      {props.value}
                    </textarea>
                  );
                return <input css={inputClass} type={type} {...props} />;
              })()}
            </Frame>
          </div>
        )}
      </AnimateContext.Consumer>
    );
  }
);
