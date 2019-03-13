import React, { useContext, useEffect } from "react";
import { Words, Button, Link } from "../../components";
import { DirectorContext } from "../../helpers/directorContext";
import Register from "./register";
import { navigate } from "gatsby";

export default () => {
  const director = useContext(DirectorContext);
  const { centers } = director;
  useEffect(() => {
    if (centers && centers.length === 1) {
      navigate(`/director/${centers[0].id}`);
    }
  });
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
          <li key={c.id}>
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
