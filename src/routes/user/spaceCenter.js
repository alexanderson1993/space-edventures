import React, { useState, useEffect } from "react";

import CENTER_MAP from "./centerMap.graphql";
import { Query } from "react-apollo";
import graphQLHelper from "../../helpers/graphQLHelper";
import { css } from "@emotion/core";

function randomFromList(list) {
  if (!list) return;
  const length = list.length;
  const index = Math.floor(Math.random() * length);
  return list[index];
}
let cachedCenter = null;
const SpaceCenterHighlight = ({ centers }) => {
  const [center, setCenter] = useState(cachedCenter);
  useEffect(() => {
    if (!center) {
      cachedCenter = randomFromList(centers);
      setCenter(cachedCenter);
    }
  }, [center, centers]);
  if (!center) return null;
  return (
    <div>
      {center.imageUrl && (
        <img
          src={center.imageUrl}
          alt={center.name}
          css={css`
            width: 200px;
            height: 200px;
            object-fit: contain;
            float: left;
            padding-right: 1em;
            padding-bottom: 1em;
          `}
        />
      )}
      <h2>{center.name}</h2>
      {center.website && (
        <p>
          <a href={center.website} target="_blank" rel="noopener noreferrer">
            {center.website}
          </a>
        </p>
      )}
      <p>{center.address && center.address.description}</p>
      <p
        css={css`
          max-height: 4em;
          clear: both;
          overflow-y: auto;
        `}
      >
        {center.description}
      </p>
    </div>
  );
};

const SpaceCenter = props => {
  return (
    <Query query={CENTER_MAP}>
      {graphQLHelper(({ centers }) => (
        <SpaceCenterHighlight centers={centers} />
      ))}
    </Query>
  );
};

export default SpaceCenter;
