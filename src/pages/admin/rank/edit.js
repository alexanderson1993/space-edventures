import React, { useState } from "react";
import { Query, Mutation } from "react-apollo";
import { Button, Input, Navigator, Words } from "../../../components";
import graphQLHelper from "../../../helpers/graphQLHelper";
import GET_RANKS from "./getRanks.graphql";
import styled from "@emotion/styled";
import UPDATE_RANK from "./updateRank.graphql";
import { Loading, Blockquote } from "@arwes/arwes";

const Form = styled("form")`
  label {
    display: flex;
    flex-direction: column;
  }
`;
export const RankEdit = ({
  id,
  name,
  description,
  flightHours,
  classHours,
  action
}) => {
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description);
  const [editFlightHours, setEditFlightHours] = useState(flightHours);
  const [editClassHours, setEditClassHours] = useState(classHours);

  return (
    <>
      <Form
        onSubmit={e => {
          e.preventDefault();
          action({
            id,
            name: editName,
            description: editDescription,
            flightHours: editFlightHours,
            classHours: editClassHours
          });
        }}
      >
        <label>
          Name
          <Input
            required
            value={editName}
            onChange={e => setEditName(e.target.value)}
          />
        </label>
        <label>
          Description
          <Input
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
          />
        </label>
        <label>
          Flight Hours
          <Input
            required
            type="number"
            value={editFlightHours}
            onChange={e => setEditFlightHours(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Class Hours
          <Input
            required
            type="number"
            value={editClassHours}
            onChange={e => setEditClassHours(parseFloat(e.target.value))}
          />
        </label>
        <Button type="submit">Save Changes</Button>
      </Form>
    </>
  );
};
const Rank = ({ id }) => {
  return (
    <div>
      <h1>Edit Rank</h1>
      <Query query={GET_RANKS}>
        {graphQLHelper(({ ranks }) => {
          const rank = ranks.find(r => r.id === id);
          return (
            <Navigator>
              {navigate => (
                <Mutation mutation={UPDATE_RANK}>
                  {(action, { loading, error }) =>
                    loading ? (
                      <Loading animate />
                    ) : (
                      <>
                        <RankEdit
                          {...rank}
                          action={variables => {
                            action({ variables }).then(() =>
                              navigate("/admin/ranks")
                            );
                          }}
                        />
                        {error && (
                          <Blockquote layer="alert">
                            <Words>{error.message}</Words>
                          </Blockquote>
                        )}
                      </>
                    )
                  }
                </Mutation>
              )}
            </Navigator>
          );
        })}
      </Query>
    </div>
  );
};

export default Rank;
