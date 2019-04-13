import React, { useState } from "react";
import css from "@emotion/css";
import { Button, Input } from "../../../components";
import UPDATE_NAME from "./updateName.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { Spacer } from "./styles";

const Name = ({ name: centerName, id, editMode }) => {
  const [name, setName] = useState(centerName);
  const [editingName, setEditingName] = useState(false);
  return (
    <Mutation mutation={UPDATE_NAME} variables={{ centerId: id, name }}>
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer
            css={css`
              display: flex;
              align-items: baseline;
            `}
          >
            {editMode && editingName ? (
              <Input value={name} onChange={e => setName(e.target.value)} />
            ) : (
              <h1>{name}</h1>
            )}
            {editMode && (
              <div>
                <Button
                  onClick={() =>
                    editingName
                      ? action().then(() => setEditingName(false))
                      : setEditingName(true)
                  }
                >
                  Update Name
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

export default Name;
