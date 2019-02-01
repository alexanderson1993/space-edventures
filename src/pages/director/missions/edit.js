import React, { useState } from "react";
import { Input, Button } from "../../../components";

const EditMission = ({ create, missionId }) => {
  const [name, setName] = useState("");
  const buttonText = `${create ? "Create" : "Update"} Simulator`;
  return (
    <div>
      <h1>{create ? "Create" : "Edit"} Mission</h1>
      <form>
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
    </div>
  );
};

export default EditMission;