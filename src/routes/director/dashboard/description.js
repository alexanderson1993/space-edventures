import React, { useState } from "react";
import { Button, Input } from "../../../components";
import UPDATE_DESCRIPTION from "./updateDescription.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { Spacer } from "./styles";

const Description = ({ editMode, description: centerDescription, id }) => {
  const [description, setDescription] = useState(centerDescription);
  const [editingDescription, setEditingDescription] = useState(false);
  return (
    <Mutation
      mutation={UPDATE_DESCRIPTION}
      variables={{ centerId: id, description }}
    >
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer>
            <h3>Description</h3>
            {editMode && editingDescription ? (
              <Input
                block
                type="textarea"
                rows={7}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            ) : (
              <p>{description}</p>
            )}
            {editMode && (
              <div>
                <Button
                  onClick={() =>
                    editingDescription
                      ? action().then(() => setEditingDescription(false))
                      : setEditingDescription(true)
                  }
                >
                  Update Description
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

export default Description;
