import React, { useState } from "react";
import { Input, Button } from "../../../components";

const EditFlightType = ({ create, flightTypeId }) => {
  const [name, setName] = useState("");
  const [flightHours, setFlightHours] = useState("");
  const [classHours, setClassHours] = useState("");
  const buttonText = `${create ? "Create" : "Update"} Flight Type`;
  return (
    <div>
      <h1>{create ? "Create" : "Edit"} FlightTypes</h1>
      <form>
        <div>
          <label>Name</label>
          <Input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Flight Hours</label>
          <Input
            name="flightHours"
            value={flightHours}
            onChange={e => setFlightHours(e.target.value)}
          />
        </div>
        <div>
          <label>Class Hours</label>
          <Input
            name="classHours"
            value={classHours}
            onChange={e => setClassHours(e.target.value)}
          />
        </div>
        <Button type="submit">{buttonText}</Button>
      </form>
    </div>
  );
};

export default EditFlightType;
