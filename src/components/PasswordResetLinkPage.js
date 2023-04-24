import { useState, useContext} from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './userContext';
import NavigationBar from './NavigationBar';

const PasswordResetLinkPage = () => {
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const {id} = useParams();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    };
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== newPassword) {
          setPasswordsMatch(false);
        } else {
          setPasswordsMatch(true);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //Attempt to change the password
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: newPassword,
                resetPasswordToken: id
            }),
        };
        try {
            const response = await fetch('http://localhost:3001/user/reset-password/', requestOptions);
            if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            }
            setResetSuccess(response.message);
            const loginOptions = {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "username": username,
                  "password": newPassword
                })
              };
        
              try {
                const loginResponse = await fetch('http://localhost:3001/login/', loginOptions);
                if (loginResponse.status === 400) {
                  throw new Error("You must enter a username and password.");
                }
                else if(loginResponse.status === 401){
                  throw new Error("invalid username or password");
                }
                const data = await loginResponse.json();
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
                setError(error.message);
              }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }
    return (
        <div>
          <NavigationBar />
            <p>&emsp;</p>
            <div className="index_body">
                <div className='box-main'></div>
                <Container>
                    <h1 text-align="center"><u>Password Reset</u></h1>
                    {resetSuccess && <Alert variant='success'>{resetSuccess}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form style={{ margin: '20px' }} onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control type="username" placeholder="Enter Username" value={username} onChange={handleUsernameChange} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" value={newPassword} onChange={handlePasswordChange} />
                        </Form.Group>
                        <Form.Group controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPassword} />
                            {!passwordsMatch && <div style={{ color: 'red' }}>Passwords do not match!</div>}
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ margin: "20px", width: "auto", height: "auto" }}>{"Reset Password"}</Button>
                    </Form>
                </Container>
            </div>
        </div>
    )
}
export default PasswordResetLinkPage;