import React, { useState } from 'react';
import { Form, Button, Container, NavLink } from 'react-bootstrap';
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // code to handle login submission
  };

  return (
    <div>
      <p>&emsp;</p>
      <div className="index_body">
        <Container>
          <h1 text-align="center">Login</h1>
          <Form style={{ margin: "20px" }} onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUserName">
              <Form.Label>Username:&emsp;</Form.Label>
              <Form.Control style={{width: "auto", display:"inline-block"}} type="username" placeholder="Username" value={username} onChange={handleUserNameChange} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>&emsp;&thinsp;&thinsp;Password:</Form.Label>
              <Form.Control style={{width:"auto", display:"inline-block", margin:"20px"}} type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
            </Form.Group>
            
            <Form.Group>
              
              <div className="btn-group">
                <Button style={{ width: "auto", margin: "20px" }} variant="primary" type="submit">Submit</Button>
              </div>
              <div className='link'>
                    <NavLink style={{margin: "20px"}} eventKey="4" as={Link} to="/register" >Need to Register?</NavLink>
              </div>
            </Form.Group>
          </Form>
        </Container>
        
      </div>
    </div>
  );
};

export default LoginPage;