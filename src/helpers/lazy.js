import React from "react";
import Loadable from "react-loadable";
import { Loading } from "@arwes/arwes";

function Loader(props) {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.pastDelay) {
    return <Loading animate />;
  } else {
    return null;
  }
}

export default function lazy(dynamicImport) {
  return Loadable({
    loader: dynamicImport,
    loading: Loader
  });
}
