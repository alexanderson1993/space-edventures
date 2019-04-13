import React, { useState, useEffect, useRef } from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import mapStyles from "./mapStyles";
import { Loading } from "@arwes/arwes";
import CENTER_MAP from "./centerMap.graphql";
import { Query } from "react-apollo";
import graphQLHelper from "../../helpers/graphQLHelper";
import { css } from "@emotion/core";

const MapMarker = ({ name, description, website, address, ...props }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  return (
    <Marker {...props} onClick={toggleOpen}>
      {open && (
        <InfoWindow onCloseClick={toggleOpen}>
          <div
            css={css`
              color: black;
              h4 {
                color: black;
              }
              a {
                color: #3f9caf;
              }
              p {
                margin-bottom: 0.5em;
              }
            `}
          >
            <h4>{name}</h4>
            {website && (
              <p>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </p>
            )}
            <p>{address.description}</p>
            {description && <p>{description}</p>}
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};
const MapComponent = withGoogleMap(({ centers }) => {
  const mapRef = useRef();
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    zoomExtends(centers);
    function zoomExtends(centers) {
      var bounds = new window.google.maps.LatLngBounds();
      if (centers.length > 0) {
        for (var i = 0; i < centers.length; i++) {
          if (centers[i].address) {
            bounds.extend(centers[i].address.location);
          }
        }
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds);
          zoomChange();
        }
      }
    }
  }, [centers]);

  function zoomChange() {
    if (mapRef.current) {
      const zoomLevel = mapRef.current.getZoom();
      setZoom(zoomLevel < 15 ? zoomLevel : 15);
    }
  }
  console.log(zoom);
  return (
    <GoogleMap
      ref={mapRef}
      clickableIcons={false}
      options={{
        styles: mapStyles,
        gestureHandling: "cooperative",
        disableDefaultUI: true
      }}
      zoom={zoom}
      defaultCenter={{ lat: 40.357, lng: -111.764 }}
      onZoomChanged={zoomChange}
    >
      {centers.map(
        c =>
          c.address && (
            <MapMarker key={c.id} position={c.address.location} {...c} />
          )
      )}
    </GoogleMap>
  );
});
const MapWrapper = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [loading]);
  if (loading) return <Loading />;
  return (
    <Query query={CENTER_MAP}>
      {graphQLHelper(({ centers }) => (
        <MapComponent
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={
            <div style={{ height: `100%`, minHeight: "400px" }} />
          }
          mapElement={<div style={{ height: `100%` }} />}
          centers={centers}
        />
      ))}
    </Query>
  );
};

export default MapWrapper;
