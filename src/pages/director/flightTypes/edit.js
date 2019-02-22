import React, { useState, useContext } from "react";
import { Input, Button, Navigator } from "../../../components";
import CREATE_FLIGHT_TYPE from "./createFlightType.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { DirectorContext } from "../index";

const EditFlightType = ({ create, flightTypeId }) => {
  const { director } = useContext(DirectorContext);
  let { center } = director;
  const [name, setName] = useState("");
  const [flightHours, setFlightHours] = useState("");
  const [classHours, setClassHours] = useState("");
  const buttonText = `${create ? "Create" : "Update"} Flight Type`;
  return (
    <Navigator>
      {navigate => (
        <Mutation
          mutation={CREATE_FLIGHT_TYPE}
          variables={{ centerId: center.id, name, flightHours, classHours }}
        >
          {(action, { loading }) =>
            loading ? (
              <Loading animate />
            ) : (
              <div>
                <h1>{create ? "Create" : "Edit"} Flight Types</h1>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    action().then(({ data: { flightTypeCreate } }) =>
                      navigate(`/director/flightTypes/${flightTypeCreate.id}`)
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
            )
          }
        </Mutation>
      )}
    </Navigator>
  );
};

export default EditFlightType;
