import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PasswordResetPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                username: username,
            }),
        };

        try {
            const response = await fetch('http://localhost:3001/user/reset-password/', requestOptions);
            if (response.status === 404) {
                throw new Error('User not found.');
            } else if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            }
            setResetSuccess(true);
        } catch (error) {
            console.error(error);
            setResetError(error.message);
        }
    };

    return (
        <div>
            <p>&emsp;</p>
            <div className="index_body">
                <div className='box-main'>
                    <Container>
                        <h1 text-align="center">Password Reset</h1>
                        {resetError && <Alert variant="danger">{resetError}</Alert>}
                        {resetSuccess ? (
                            <Alert variant="success">An email has been sent to your account.</Alert>
                        ) : (
                            <Form style={{ margin: '20px' }} onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
                                </Form.Group>
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={handleUsernameChange} />
                                </Form.Group>
                                <Button variant="primary" type="submit" style={{ margin: "20px", width: "auto", height: "auto" }}>{"Reset Password"}</Button>
                            </Form>
                        )}
                        <Button variant="secondary" style={{ width: "auto", height: "auto" }} onClick={() => navigate(`${process.env.PUBLIC_URL}/login`)}>{"Close"}</Button>
                    </Container>
                </div>
            </div>
        </div>
    );
};
export default PasswordResetPage;