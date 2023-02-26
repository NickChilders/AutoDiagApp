import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [Password, setPassword, confirmPassword, checkPassword] = useState('')
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission here
  };

  return (
    <Container>
      <Form action={`${process.env.PUBLIC_URL}/register`} style={{ margin: "20px"}} onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              Username:
              <input type="text" className="form-control" placeholder="Enter username here." value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Email:
              <input type="email" className="form-control" placeholder="Enter email here." value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Vehicle Make:
              <input type="text" className="form-control" placeholder="(Ex. Toyota)" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Vehicle Model:
              <input type="text" className="form-control" placeholder="(Ex. Camry LE)" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Vehicle Year:
              <input type="number" className="form-control" placeholder="(Ex. 2014)" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Password:
              <input type="password" className="form-control" placeholder="Enter a unique password." value={Password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Confirm Password:
              <input type="password" className="form-control" placeholder="Re-enter password." value={confirmPassword} onChange={(e) => checkPassword(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <div className='btn-group'>
        <Button style={{width:"auto", height:"auto",margin: "20px"}} variant="primary" type="submit">Register</Button>
        </div>
      </Form>
    </Container>
  );
};

export default RegistrationPage;