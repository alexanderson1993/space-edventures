import React from "react";
import { Mutation } from "react-apollo";
import { Navigator, Words } from "../../../components";
import CREATE_RANK from "./createRank.graphql";
import GET_RANKS from "./getRanks.graphql";
import { Loading, Blockquote } from "@arwes/arwes";
import { RankEdit } from "./edit";

const Rank = ({ id }) => {
  return (
    <div>
      <h1>Create Rank</h1>
      <Navigator>
        {navigate => (
          <Mutation
            mutation={CREATE_RANK}
            update={(cache, { data: { rankCreate } }) => {
              const { ranks } = cache.readQuery({
                query: GET_RANKS
              });
              cache.writeQuery({
                query: GET_RANKS,
                data: { ranks: ranks.concat([rankCreate]) }
              });
            }}
          >
            {(action, { loading, error }) =>
              loading ? (
                <Loading animate />
              ) : (
                <>
                  <RankEdit
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
    </div>
  );
};

export default Rank;
