import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import mapStyles from "./mapStyles";
import { Loading } from "@arwes/arwes";

const MapMarker = ({ ...props }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  return (
    <Marker {...props} onClick={toggleOpen}>
      {open && (
        <InfoWindow onCloseClick={toggleOpen}>
          <div>Space Center</div>
        </InfoWindow>
      )}
    </Marker>
  );
};
const MapComponent = withGoogleMap(props => {
  return (
    <GoogleMap
      clickableIcons={false}
      options={{
        styles: mapStyles,
        gestureHandling: "cooperative",
        disableDefaultUI: true
      }}
      defaultZoom={11}
      defaultCenter={{ lat: 40.357, lng: -111.764 }}
    >
      {/* TODO: Add these markers dynamically from the centers */}
      <MapMarker position={{ lat: 40.430437, lng: -111.8347337 }} />
      <MapMarker position={{ lat: 40.4017056, lng: -111.7526479 }} />
      <MapMarker position={{ lat: 40.3648575, lng: -111.7358007 }} />
      <MapMarker position={{ lat: 40.2859766, lng: -111.7364041 }} />
      <MapMarker position={{ lat: 40.3685109, lng: -111.9302172 }} />
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
    <MapComponent
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100%`, minHeight: "400px" }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
};

export default MapWrapper;
