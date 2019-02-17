import React from "react";
import DatePicker from "react-date-picker";
import "./datepicker.css";
import { Frame, withStyles } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";
import styled from "@emotion/styled";
import { transparentize, darken } from "polished";

const DatePickerComp = ({ theme, ...props }) => {
  const { show } = React.useContext(AnimateContext);

  const StyleFrame = styled(Frame)`
    overflow: visible;
    input {
      color: ${theme.color.primary.base};
    }
    div {
      overflow: visible;
    }
    .react-calendar {
      border: solid 1px ${theme.color.primary.base};
      background-color: rgba(0, 0, 0, 0.8);
      * {
        color: ${theme.color.primary.base};
      }
      .react-calendar__navigation button:enabled:hover,
      .react-calendar__tile:enabled:hover,
      .react-calendar__tile--active:enabled:focus {
        background-color: ${transparentize(0.8, theme.color.primary.base)};
      }
    }
    .react-date-picker__button g {
      stroke: ${theme.color.primary.base} !important;
    }
    .react-date-picker__button:hover g {
      stroke: ${darken(0.2, theme.color.primary.base)} !important;
    }
  `;
  return (
    <StyleFrame className="AWESOME" hover corners={2} show={show} animate>
      <DatePicker {...props} />
    </StyleFrame>
  );
};

export default React.memo(withStyles(() => {})(DatePickerComp));
