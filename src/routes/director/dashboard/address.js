import React, { useReducer, useState } from "react";
import { Button, Input } from "../../../components";
import UPDATE_ADDRESS from "./updateAddress.graphql";
import { Loading } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import { Spacer } from "./styles";
import GeoSuggest from "react-geosuggest";
import css from "@emotion/css";

function reducer(state, action) {
  if (!action) return state;
  return { description: action.description, location: action.location };
}

const Address = ({ id, address: centerAddress, editMode }) => {
  const [address, dispatch] = useReducer(reducer, centerAddress);
  const [editingAddress, setEditingAddress] = useState(true); // TODO: CHANGE TO FALSE
  return (
    <Mutation mutation={UPDATE_ADDRESS}>
      {(action, { loading }) =>
        loading ? (
          <Loading animate />
        ) : (
          <Spacer>
            <h3>Address</h3>
            {editMode && editingAddress ? (
              <div
                css={css`
                  .geosuggest {
                    font-size: 24px;
                    position: relative;
                    text-align: left;
                  }
                  .geosuggest__input {
                    color: white;
                    font-size: 18px;
                    background-color: black;
                    border: 2px solid transparent;
                    box-shadow: 0 0 1px #3d464d;
                    padding: 0.5em 1em;
                    -webkit-transition: border 0.2s, box-shadow 0.2s;
                    transition: border 0.2s, box-shadow 0.2s;
                  }
                  .geosuggest__input:focus {
                    border-color: #267dc0;
                    box-shadow: 0 0 0 transparent;
                  }
                  .geosuggest__suggests {
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    right: 0;
                    max-height: 25em;
                    padding: 0;
                    margin-top: -1px;
                    background: #000;
                    border: 2px solid #267dc0;
                    overflow-x: hidden;
                    overflow-y: auto;
                    list-style: none;
                    z-index: 5;
                    -webkit-transition: max-height 0.2s, border 0.2s;
                    transition: max-height 0.2s, border 0.2s;
                  }
                  .geosuggest__suggests--hidden {
                    max-height: 0;
                    overflow: hidden;
                    border-width: 0;
                  }

                  /**
                  * A geosuggest item
                  */
                  .geosuggest__item {
                    font-size: 18px;
                    font-size: 1rem;
                    padding: 0.5em 0.65em;
                    cursor: pointer;
                  }
                  .geosuggest__item:hover,
                  .geosuggest__item:focus {
                    background: #267dc0;
                  }
                  .geosuggest__item--active {
                    background: #267dc0;
                    color: #fff;
                  }
                  .geosuggest__item--active:hover,
                  .geosuggest__item--active:focus {
                    background: #267dc0;
                  }
                  .geosuggest__item__matched-text {
                    font-weight: bold;
                  }
                `}
              >
                <GeoSuggest
                  types={["geocode"]}
                  onSuggestSelect={suggestion => {
                    dispatch(suggestion);
                    if (suggestion) {
                      action({
                        variables: {
                          centerId: id,
                          address: {
                            description: suggestion.description,
                            location: suggestion.location
                          }
                        }
                      });
                      setEditingAddress(false);
                    }
                  }}
                />
              </div>
            ) : (
              <p>{address ? address.description : "No Address Listed"}</p>
            )}
            {editMode && !editingAddress && (
              <div>
                <Button onClick={() => setEditingAddress(true)}>
                  Update Address
                </Button>
              </div>
            )}
          </Spacer>
        )
      }
    </Mutation>
  );
};

export default Address;
