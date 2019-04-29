import React from "react";
import ReactDOM from "react-dom";
import "./datepicker.css";
import { Frame, withStyles } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";
import styled from "@emotion/styled";
import { transparentize, darken } from "polished";
const DatePicker = React.lazy(() => import("react-date-picker"));

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
    .react-date-picker__calendar {
      width: 100%;
      position: relative;
    }
    .react-calendar {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      z-index: 100000000;
      top: -350px;
      position: absolute;
      border: solid 1px ${theme.color.primary.base};
      background-color: rgba(0, 0, 0, 0.9);
      * {
        color: ${theme.color.primary.base};
      }
      .react-calendar__tile,
      .react-calendar__navigation button {
        font-size: 18px;
      }
      .react-calendar__navigation button:enabled:hover,
      .react-calendar__tile:enabled:hover,
      .react-calendar__tile:enabled:focus,
      .react-calendar__navigation button:enabled:focus,
      .react-calendar__navigation button[disabled] {
        background-color: ${transparentize(0.8, theme.color.primary.base)};
      }
      .react-calendar__year-view .react-calendar__tile,
      .react-calendar__decade-view .react-calendar__tile,
      .react-calendar__century-view .react-calendar__tile {
        padding: 1em 0.5em;
      }
    }
    .react-date-picker {
      width: 100%;
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

export default withStyles(() => {})(DatePickerComp);
