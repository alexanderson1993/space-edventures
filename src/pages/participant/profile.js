import React from "react";
import { Container, Row, Col, FormGroup, Label, Table } from "reactstrap";
import { Words, Image, Button, Input, Link } from "../../components";
import UserContext from "../../helpers/userContext";
import "./profile.scss";

const Profile = () => {
  return (
    <UserContext.Consumer>
      {({ user }) => (
        <Container className="profile-page">
          <h1>
            {" "}
            <Words>Profile</Words>
          </h1>
          <Row>
            <Col sm={4}>
              <Image className="profile-image" src={user.profile} />
              <Button>Edit Profile Picture</Button>
            </Col>
            <Col sm={8}>
              <FormGroup>
                <Label>
                  Name
                  <Input block type="text" defaultValue={user.name} />
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  Display Name
                  <Input block type="text" defaultValue={user.displayName} />
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>Rank</Label>
                <h3>{user.rank}</h3>
                <div>Flight Hours: {user.flightHours}</div>
                <div>Class Hours: {user.classHours}</div>
              </FormGroup>
              <Link to="/profile/certificate">
                <Button>View Rank Certificate</Button>
              </Link>
            </Col>
          </Row>
          <div style={{ marginTop: "30px" }} />
          <Row>
            <Col sm={12}>
              <h2>History</h2>

              <Table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Center</th>
                    <th>Simulator</th>
                    <th>Station</th>
                    <th>Mission</th>
                  </tr>
                </thead>
                <tbody>
                  {user.history.map(h => (
                    <tr key={h.id}>
                      <td>{h.date.toLocaleDateString()}</td>
                      <td>{h.center}</td>
                      <td>{h.simulator}</td>
                      <td>{h.station}</td>
                      <td>{h.mission}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      )}
    </UserContext.Consumer>
  );
};

export default Profile;
