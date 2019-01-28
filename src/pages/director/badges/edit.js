import React, { useState } from "react";
import { Input, Button } from "../../../components";

const EditBadge = ({ create, simulatorId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const buttonText = `${create ? "Create" : "Update"} Badge`;
  return (
    <div>
      <h1>{create ? "Create" : "Edit"} Badge</h1>
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
          <label>Description</label>
          <Input
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <Button type="submit">{buttonText}</Button>
      </form>
    </div>
  );
};

export default EditBadge;
