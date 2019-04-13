import React, { useState } from "react";
import { Button, Input } from "../../../components";
import UPDATE_WEBSITE from "./updateWebsite.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { Spacer } from "./styles";

const Website = ({ id, website: centerWebsite, editMode }) => {
  const [website, setWebsite] = useState(centerWebsite);
  const [editingWebsite, setEditingWebsite] = useState(false);
  return (
    <Mutation mutation={UPDATE_WEBSITE} variables={{ centerId: id, website }}>
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer>
            <h3>Website</h3>
            {editMode && editingWebsite ? (
              <>
                <Input
                  block
                  type="url"
                  value={website}
                  placeholder="https://spaceedventures.org"
                  onChange={e => setWebsite(e.target.value)}
                />
                <small>
                  Make sure you include <code>http://</code>
                </small>
              </>
            ) : (
              <a href={website} target="_blank" rel="noopener noreferrer">
                {website}
              </a>
            )}
            {editMode && (
              <div>
                <Button
                  onClick={() =>
                    editingWebsite
                      ? action().then(() => setEditingWebsite(false))
                      : setEditingWebsite(true)
                  }
                >
                  Update Website
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

export default Website;
