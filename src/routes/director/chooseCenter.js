import React, { useContext } from "react";
import { Words, Button, Link } from "../../components";
import { DirectorContext } from "../../helpers/directorContext";
import Register from "./register";

export default () => {
  const director = useContext(DirectorContext);
  if (!director || director.centers.length === 0) {
    return <Register />;
  }
  return (
    <div>
      <h1>
        <Words>Choose Center</Words>
      </h1>
      <ul>
        {director.centers.map(c => (
          <li>
            <Link to={`/director/${c.id}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/director/register">
        <Button>Register a New Center</Button>
      </Link>
    </div>
  );
};
