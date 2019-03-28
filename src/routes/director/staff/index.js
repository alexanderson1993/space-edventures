import React, { useContext, useState } from "react";
import { Query, Mutation } from "react-apollo";
import GET_STAFF from "./getStaff.graphql";
import REMOVE_STAFF from "./removeStaff.graphql";
import ADD_STAFF from "./addStaff.graphql";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Table, Button, Modal, Input, Words } from "../../../components";
import { CenterContext } from "../../../pages/director";
import { titleCase } from "change-case";
import css from "@emotion/css";
import { Blockquote, Loading } from "@arwes/arwes";

const Staff = () => {
  const center = useContext(CenterContext);
  const [email, setEmail] = useState("");
  const [remove, setRemove] = useState(false);
  const refetch = [{ query: GET_STAFF, variables: { centerId: center.id } }];
  return (
    <div>
      <h1>Staff</h1>
      <label>
        Add User
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Mutation
            mutation={ADD_STAFF}
            variables={{ centerId: center.id, email }}
            refetchQueries={refetch}
          >
            {(action, { error, loading }) => (
              <>
                <Button
                  disabled={loading || !email}
                  onClick={() =>
                    action()
                      .then(() => setEmail(""))
                      .catch(e => e)
                  }
                >
                  {loading ? "Adding user..." : "Add User"}
                </Button>
                {error && (
                  <div>
                    <Blockquote layer="alert">
                      <Words>{error.message}</Words>
                    </Blockquote>
                  </div>
                )}
              </>
            )}
          </Mutation>
        </div>
      </label>
      <Query query={GET_STAFF} variables={{ centerId: center.id }}>
        {graphQLHelper(({ center: { users } }) => (
          <Table>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{titleCase(u.roles)}</td>
                    <td>
                      {u.roles !== "director" && (
                        <Button layer="alert" onClick={() => setRemove(u)}>
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        ))}
      </Query>
      <Modal show={remove} onCancel={() => setRemove(false)}>
        {remove && (
          <Mutation
            mutation={REMOVE_STAFF}
            variables={{ centerId: center.id, userId: remove.id }}
            refetchQueries={refetch}
          >
            {(action, { error, loading }) =>
              loading ? (
                <Loading animate />
              ) : (
                <div
                  css={css`
                    min-width: 100px;
                  `}
                >
                  <h2>Remove User {remove.email}</h2>
                  <p>
                    Are you sure you want to remove {remove.email}? This user
                    will no longer have access to your center's staff tools.
                  </p>
                  {error && (
                    <div>
                      <Blockquote layer="alert">
                        <Words>{error.message}</Words>
                      </Blockquote>
                    </div>
                  )}
                  <div
                    css={css`
                      display: flex;
                      justify-content: flex-end;
                    `}
                  >
                    <Button onClick={() => setRemove(false)}>Cancel</Button>
                    <Button
                      layer="alert"
                      onClick={() => action().then(() => setRemove(false))}
                    >
                      Remove User
                    </Button>
                  </div>
                </div>
              )
            }
          </Mutation>
        )}
      </Modal>
    </div>
  );
};
export default Staff;
