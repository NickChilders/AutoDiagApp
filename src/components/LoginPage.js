import React, { useState, useContext } from 'react';
import { Form, Button, Container, NavLink, Alert, Row, Col} from 'react-bootstrap';
import { PencilSquare, Lock }from 'react-bootstrap-icons';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './userContext';

const LoginPage = () => {
  const {setUser} = useContext(UserContext);
  const navigate = useNavigate()
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setloginError] = useState('');

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    };
    
    try {
      const response = await fetch('http://localhost:3001/login/', requestOptions);
      if (response.status === 400) {
        throw new Error("You must enter a username and password.");
      }
      else if(response.status === 401){
        throw new Error("invalid username or password");
      }
      const data = await response.json();
      setUser({
        username: data.username,
        userEmail: data.email,
        vehicleVIN: data.vehicleVIN,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleSeries: data.vehicleSeries,
        vehicleYear: data.vehicleYear,
        vehicleImgUrl: data.vehicleImgUrl,
        token: data.token
      });
      navigate(`${process.env.PUBLIC_URL}/`);
    } catch (error) {
      console.error(error);
      setloginError(error.message);
    }
  };
  
  return (
    <div>
      <p>&emsp;</p>
      <div className="index_body">
        <Container>
          <h1 text-align="center">Login</h1>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form style={{ margin: "20px" }} onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUserName">
              <Row>
                <Col>
                  <Form.Label>Username:&emsp;</Form.Label>
                  <Form.Control style={{width: "auto", display:"inline-block"}} type="username" placeholder="Username" value={username} onChange={handleUserNameChange} />
                </Col>
              </Row>
            </Form.Group>
            <div>&emsp;</div>
            <Form.Group controlId="formBasicPassword">
              <Row>
                <Col>
                  <Form.Label>Password:&emsp;</Form.Label>
                  <Form.Control style={{width:"auto", display:"inline-block"}} type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <div className="btn-group">
                <Button style={{ width: "auto", height:"auto", margin: "20px" }} variant="primary" type="submit">Submit</Button>
              </div>
              <div className='link'>
                    <NavLink style={{margin: "20px"}} eventkey="4" as={Link} to={`${process.env.PUBLIC_URL}/register`} >&emsp;Need to Register?&emsp;<PencilSquare /></NavLink>
                    <NavLink style={{margin: "20px"}} eventkey="5" as={Link} to={`${process.env.PUBLIC_URL}/reset-password`} >&emsp;Forgot Password?&emsp;<Lock /></NavLink>
              </div>
            </Form.Group>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;