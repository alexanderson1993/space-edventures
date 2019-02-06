import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import { Input, Button, Navigator } from "../../../components";
import CREATE_SIMULATOR from "./createSimulator.graphql";
import RENAME_SIMULATOR from "./renameSimulator.graphql";
import { Loading } from "@arwes/arwes";
import SIMULATORS_QUERY from "./simulators.graphql";
import graphQLHelper from "../../../helpers/graphQLHelper";

const EditSimulator = ({ simulator, create, simulatorId }) => {
  const [name, setName] = useState(() => (simulator ? simulator.name : ""));
  console.log(simulator, name);
  const buttonText = `${create ? "Create" : "Update"} Simulator`;
  return (
    <div>
      <h1>
        {create ? "Create" : "Edit"} Simulator
        {simulator && `: ${simulator.name}`}
      </h1>
      <Navigator>
        {navigate => (
          <Mutation mutation={RENAME_SIMULATOR}>
            {(renameSim, { loading: loading1 }) => (
              <Mutation mutation={CREATE_SIMULATOR}>
                {(createSim, { loading: loading2 }) =>
                  loading1 || loading2 ? (
                    <Loading animate />
                  ) : (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        (create
                          ? createSim({ variables: { name } })
                          : renameSim({
                              variables: { id: simulatorId, name }
                            })
                        ).then(
                          ({ data: { simulatorCreate, simulatorRename } }) => {
                            const { id } = simulatorCreate || simulatorRename;
                            navigate(`/director/simulators/${id}`);
                          }
                        );
                      }}
                    >
                      <div>
                        <label>Name</label>
                        <Input
                          name="name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                        />
                      </div>
                      <Button type="submit">{buttonText}</Button>
                    </form>
                  )
                }
              </Mutation>
            )}
          </Mutation>
        )}
      </Navigator>
    </div>
  );
};
const EditSimulatorData = ({ create, simulatorId }) => {
  return (
    <Query query={SIMULATORS_QUERY} skip={!simulatorId}>
      {graphQLHelper(({ simulators }) => {
        const simulator =
          simulators && simulators.find(s => s.id === simulatorId);
        return (
          <EditSimulator
            simulator={simulator}
            create={create}
            simulatorId={simulatorId}
          />
        );
      })}
    </Query>
  );
};

export default EditSimulatorData;
