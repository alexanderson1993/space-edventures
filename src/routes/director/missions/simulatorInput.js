import React, { useContext } from "react";
import { Query } from "react-apollo";
import SIMULATORS_QUERY from "./simulators.graphql";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Select } from "../../../components";
import { CenterContext } from "../../../pages/director";

const SimulatorIndex = ({ multiple, value = "", onChange }) => {
  const center = useContext(CenterContext);
  return (
    <Query query={SIMULATORS_QUERY} variables={{ centerId: center.id }}>
      {graphQLHelper(({ simulators }) => (
        <>
          <Select value={multiple ? "" : value} onChange={onChange}>
            {simulators && simulators.length ? (
              <>
                <option disabled value="">
                  Select a Simulator
                </option>
                {simulators.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </>
            ) : (
              <option disabled>No Simulators.</option>
            )}
          </Select>
          {multiple && (
            <>
              <ul>
                {value
                  .map(v => simulators.find(s => s.id === v))
                  .map(s => (
                    <li
                      key={s.id}
                      onClick={() => onChange({ target: { value: s.id } })}
                    >
                      {s.name}
                    </li>
                  ))}
              </ul>
              <small>Click to remove.</small>
            </>
          )}
        </>
      ))}
    </Query>
  );
};

export default SimulatorIndex;
