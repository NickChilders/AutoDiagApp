import React, { useState, useContext } from 'react';
import { UserContext } from './userContext';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const RegistrationPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [usr, setUsr] = useState('');
  const [email, setEmail] = useState('');
  const [vin, setVin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const fetchVehicleInfo = async (vin) => {
    let url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended/${vin}?format=json`;
    const response = await fetch(url);
    const data = await response.json();
    const make = data.Results[7].Value;
    const model = data.Results[9].Value;
    const year = data.Results[10].Value;

    return { make, model, year };
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get vehicle information
    const { make, model, year} = await fetchVehicleInfo(vin);

    // Redirect to home page with username parameter
    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        username: usr,
        password: password,
        email: email,
        vehicleVIN: vin,
        vehicleMake: make,
        vehicleModel: model,
        vehicleYear: year,
      }),
    };
    await fetch(`http://localhost:3001/`, requestOptions)
    .then(async (response) => {
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = response.status;
        return Promise.reject(error);
      }
      else {
        const data = await response.json(); // parse JSON response
        setUser({
          username: usr,
          userEmail: email,
          vehicles: data.vehicles,
          token: data.token, // access token from parsed JSON
        });
        navigate(`${process.env.PUBLIC_URL}/`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <Container>
      <Form action={`${process.env.PUBLIC_URL}/register`} style={{ margin: "20px" }} onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              Username:
              <input type="text" className="form-control" placeholder="Enter username here." value={usr} onChange={(e) => setUsr(e.target.value)} />
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
              Vehicle VIN:
              <input type="text" className="form-control" placeholder="#################" value={vin} onChange={(e) => setVin(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Password:
              <input type="password" className="form-control" placeholder="Enter a unique password." value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Confirm Password:
              <input type="password" className="form-control" placeholder="Re-enter password." value={confirmPassword} onChange={handleConfirmPasswordChange} />
            </Form.Label>
            {!passwordsMatch && <div style={{ color: 'red' }}>Passwords do not match!</div>}
          </Col>
        </Row>
        <div className='btn-group'>
          <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="submit">Register</Button>
        </div>
      </Form>
    </Container>

  );
};

export default RegistrationPage;