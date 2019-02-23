import React, { useState, useContext } from "react";
import { Input, Button, Navigator, Words } from "../../../components";
import FLIGHT_TYPES from "./flightTypes.graphql";
import CREATE_FLIGHT_TYPE from "./createFlightType.graphql";
import UPDATE_FLIGHT_TYPE from "./updateFlightType.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation, Query } from "react-apollo";
import { DirectorContext } from "../index";
import Blockquote from "@arwes/arwes/lib/Blockquote";
const Editor = ({
  create,
  action,
  center,
  flightTypeId,
  name: flightTypeName,
  flightHours: flightTypeFlightHours,
  classHours: flightTypeClassHours
}) => {
  const [name, setName] = useState(flightTypeName || "");
  const [flightHours, setFlightHours] = useState(flightTypeFlightHours || "");
  const [classHours, setClassHours] = useState(flightTypeClassHours || "");
  const buttonText = `${create ? "Create" : "Update"} Flight Type`;
  return (
    <Navigator>
      {navigate => (
        <div>
          <h1>{create ? "Create" : "Edit"} Flight Types</h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              action({
                variables: {
                  id: flightTypeId,
                  centerId: center.id,
                  name,
                  flightHours,
                  classHours
                }
              }).then(({ data: { flightTypeCreate, flightTypeEdit } }) =>
                navigate(
                  `/director/flightTypes/${
                    flightTypeEdit ? flightTypeEdit.id : flightTypeCreate.id
                  }`
                )
              );
            }}
          >
            <div>
              <label>Name</label>
              <Input
                name="name"
                defaultValue={name}
                onBlur={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Flight Hours</label>
              <Input
                type="number"
                name="flightHours"
                defaultValue={flightHours}
                onBlur={e => setFlightHours(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label>Class Hours</label>
              <Input
                type="number"
                name="classHours"
                defaultValue={classHours}
                onBlur={e => setClassHours(parseFloat(e.target.value))}
              />
            </div>
            <Button type="submit">{buttonText}</Button>
          </form>
        </div>
      )}
    </Navigator>
  );
};
const EditFlightType = ({ create, flightTypeId }) => {
  const { director } = useContext(DirectorContext);
  let { center } = director;

  return (
    <Query query={FLIGHT_TYPES} skip={create}>
      {({ loading, data = {} }) => {
        if (loading) return <Loading animate />;
        const { flightTypes = [] } = data;
        const flightType = flightTypes.find(f => f.id === flightTypeId) || {};
        return (
          <Mutation mutation={UPDATE_FLIGHT_TYPE}>
            {(update, { loading: loading2, error: error2 }) => (
              <Mutation
                mutation={CREATE_FLIGHT_TYPE}
                update={(cache, { data: { flightTypeCreate } }) => {
                  const { flightTypes } = cache.readQuery({
                    query: FLIGHT_TYPES
                  });
                  cache.writeQuery({
                    query: FLIGHT_TYPES,
                    data: {
                      flightTypes: flightTypes.concat([flightTypeCreate])
                    }
                  });
                }}
              >
                {(action, { loading, error }) =>
                  loading || loading2 ? (
                    <Loading animate />
                  ) : (
                    <>
                      <Editor
                        {...flightType}
                        create={create}
                        action={create ? action : update}
                        center={center}
                        flightTypeId={flightTypeId}
                      />
                      {(error || error2) && (
                        <Blockquote layer="alert">
                          <Words>
                            {error ? error.message : error2.message}
                          </Words>
                        </Blockquote>
                      )}
                    </>
                  )
                }
              </Mutation>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default EditFlightType;
