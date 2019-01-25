import React from "react";

import { Link, Button } from "../../components";

const Dashboard = () => {
  return (
    <>
      <h1>Director Dashboard</h1>
      <h2 style={{ display: "flex", justifyContent: "space-between" }}>
        Lehi Space Center
      </h2>
      <h3>Space Center Description</h3>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
        quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
        eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
        voluptas nulla pariatur
      </p>
      <h3>Space Center Address</h3>
      <p>
        555 North Somewhere Street
        <br />
        Room Number 5067
        <br />
        Provo UT 98765
      </p>
      <h3>Badges</h3>
      <Badge />
      <Badge />
      <h3>Missions</h3>
      <Mission />
      <Mission />
    </>
  );
};

let Badge = () => {
  let style_badge = {
    width: "100%",
    backgroundColor: "#1B9493",
    display: "flex",
    padding: "20px",
    marginBottom: "10px"
  };
  return <div style={style_badge}>Here is a test text</div>;
};

let Mission = () => {
  let style_mission = {
    width: "100%",
    backgroundColor: "#1B9493",
    display: "flex",
    padding: "20px",
    marginBottom: "10px"
  };
  return <div style={style_mission}>Here is a test text</div>;
};

export default Dashboard;
