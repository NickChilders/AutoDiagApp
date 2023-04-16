import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { UserContext } from './userContext';

const MaintenanceNewJob = () => {
    const { user } = useContext(UserContext);
    const [heading, setHeading] = useState("");
    const [steps, setSteps] = useState([{ description: "", imageUrl: "" }]);
    const [imageUrl, setImageUrl] = useState("");
    const [imgUrl, setImgUrl] = useState('');
    const [vin, setVin] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicles, setVehicles] = useState([]);
    const history = useNavigate();

    /********************************************************************\  
        Desc.:  Fetch data from the specified URL and update the state
                variables and local storage based on the retrieved data
        Input:  Server URL to the "<ServerURL>/users/<token>" endpoint
    \********************************************************************/
    const fetchUserData = async (userDataUrl) => {
        try {
            // Send a GET request to the provided URL.
            const response = await fetch(userDataUrl);
            // If the response is not okay, throw an error.
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Convert the response body to JSON
            const data = await response.json();
            // Update state variables with the response data.
            setVin(data.vehicleVIN);
            setImgUrl(data.vehicleImgUrl);
            setMake(data.vehicleMake);
            setModel(data.vehicleModel);
            setYear(data.vehicleYear);
            // Store the entire data object in local storage
            localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
            // Log any errors that occur
            console.error('Error fetching image:', error);
        }
    }

    /************************************************************************************\
        Desc.:  This effect function will run whenever the `vehicles` dependency changes.
    *************************************************************************************/
    useEffect(() => {
        // Check if there are any vehicles in the `vehicles` array state.
        if (vehicles.length > 0) {
            // Find and use the main vehicle's index if it exists. Otherwise, use 0.
            const mainVehicleIndex = vehicles.findIndex(vehicle => vehicle.mainVehicle === true);
            const newIndex = mainVehicleIndex !== -1 ? mainVehicleIndex : 0;
            // Update the current index state with the new index.
            setCurrentIndex(newIndex);
            // Set the state variables.
            setVin(vehicles[newIndex].vehicleVIN);
            setImgUrl(vehicles[newIndex].vehicleImgUrl);
            setMake(vehicles[newIndex].vehicleMake);
            setModel(vehicles[newIndex].vehicleModel);
            setYear(vehicles[newIndex].vehicleYear);
        }
    }, [vehicles]);

    /************************************************************************\
        Desc.:  This effect function will run whenever the component updates.
    *************************************************************************/
    useEffect(() => {
        // Retrieve the userData object from localStorage and parse it to a JavaScript object
        const userData = JSON.parse(localStorage.getItem('userData'));
        // Check if the userData object exists and contains a token
        if (userData && userData.token) {
            // Construct a URL to fetch the user's data based on the token, and call fetchUserData.
            const userDataUrl = `http://localhost:3001/users/${userData.token}`;
            fetchUserData(userDataUrl);
        } else if (userData) {
            // Else if the userData object doesn't contain a token, look for the user's main vehicle and set the states accordingly
            const mainVehicle = userData.vehicles.find(
                (vehicle) => vehicle.mainVehicle === true
            );
            if (mainVehicle) {
                setVin(mainVehicle.vehicleVIN);
                setImgUrl(mainVehicle.vehicleImgUrl);
                setMake(mainVehicle.vehicleMake);
                setModel(mainVehicle.vehicleModel);
                setYear(mainVehicle.vehicleYear);
            } else if (userData.vehicles.length > 0) {
                // If  the user doesn't have a main vehicle, set the states based on the first vehicle in the vehicles array.
                setVin(userData.vehicles[0].vehicleVIN);
                setImgUrl(userData.vehicles[0].vehicleImgUrl);
                setMake(userData.vehicles[0].vehicleMake);
                setModel(userData.vehicles[0].vehicleModel);
                setYear(userData.vehicles[0].vehicleYear);
            }
        }
        //The second argument in this useEffect is an array of dependencies, but since this code doesn't have any dependencies, it is an empty array.
    }, []);

    /*************************************************************************\
        Desc.:  This effect function will run whenever user object is updated.
                It will fetch user data from the server.
    **************************************************************************/
    useEffect(() => {
        // Define an async function to fetch user data from the server.
        const getImg = async (userData) => {
            if (userData) {
                try {
                    // If user data is present, extract the token from the user data.
                    const token = userData?.token;
                    // Persist the user's token in localStorage.
                    localStorage.setItem('token', token);
                    // Make a GET request to fetch user's data from the server.
                    const response = await fetch(`http://localhost:3001/users/${userData.token}`);
                    // Throw an error if the response is not OK
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // Extract the data from the response
                    const data = await response.json();
                    // Set the state for the vehicle's details
                    data.vehicles.map((vehicle => {
                        if (vehicle.mainVehicle === true) {
                            setVin(vehicle.vehicleVIN);
                            setImgUrl(vehicle.vehicleImgUrl);
                            setMake(vehicle.vehicleMake);
                            setModel(vehicle.vehicleModel);
                            setYear(vehicle.vehicleYear);
                        }
                    }))
                    // Set the state for all the vehicles belonging to the user
                    setVehicles(data.vehicles.map((vehicle) => {
                        return {
                            mainVehicle: vehicle.mainVehicle,
                            vehicleVIN: vehicle.vehicleVIN,
                            vehicleMake: vehicle.vehicleMake,
                            vehicleModel: vehicle.vehicleModel,
                            vehicleYear: vehicle.vehicleYear,
                            vehicleImgUrl: vehicle.vehicleImgUrl,
                        };
                    }));
                    // Persist the user's data in localStorage
                    localStorage.setItem('userData', JSON.stringify(data));
                } catch (error) {
                    // Log any errors that occur while fetching user data
                    console.error('Error fetching image:', error);
                }
            }
        };
        // Call the getImg function with the user object as an argument.
        getImg(user);
    }, [user]);

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        const newSteps = [...steps, { description: "", imageUrl: "" }];
        setSteps(newSteps);
    };

    const removeStep = (index) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    const handleCancel = () => {
        history(`${process.env.PUBLIC_URL}/maintenance`);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = localStorage.getItem('userData')
        const parsedData = JSON.parse(data);
        try {
            const response = await fetch("http://localhost:3001/api/maintenance/job", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    heading: heading,
                    steps: steps,
                    vehicleMake: make,
                    vehicleModel: model,
                    vehicleYear: year,
                    author: parsedData.username
                })
            });
            if(response.ok)
                history(`${process.env.PUBLIC_URL}/maintenance`);
        }
        catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <div className="index_body">
                <section>
                    <Container>
                        <div className="box-main">
                            <div className="job-form">
                                <h1>New Job</h1>
                                <Form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <Form.Label htmlFor="heading">Heading</Form.Label>
                                        <input type="text" className="form-control" id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} required />
                                    </div>
                                    {steps.map((step, index) => (
                                        <div key={index}>
                                            <div className="form-group">
                                                <Form.Label htmlFor={`description-${index}`}>Step {index + 1} Description</Form.Label>
                                                <textarea className="form-control" id={`description-${index}`} rows="5" cols="20" value={step.description} onChange={(e) => handleStepChange(index, 'description', e.target.value)} required></textarea>
                                            </div>
                                            <div className="form-group">
                                                <Form.Label htmlFor={`imageUrl-${index}`}>Step {index + 1} Image URL (Optional)</Form.Label>
                                                <input type="text" className="form-control" id={`imageUrl-${index}`} value={step.imageUrl} onChange={(e) => handleStepChange(index, 'imageUrl', e.target.value)} />
                                            </div>
                                            {steps.length > 1 && <Button className="btn btn-primary" style={{ margin: "20px", width: "auto", height: "auto", backgroundColor: "red", borderColor: "red" }} onClick={() => removeStep(index)}>Remove Step {index + 1}</Button>}
                                        </div>
                                    ))}
                                    <Button className="btn btn-primary" style={{ margin: "20px", width: "auto", height: "auto" }} onClick={addStep}>Add Step</Button>
                                    <Button type="submit" className="btn btn-primary" style={{ margin: "20px", width: "auto", height: "auto" }}>Submit</Button>
                                    <Row><Col>
                                    <Button type="cancel" className="btn btn-primary" style={{ margin: "20px", width: "auto", height: "auto", backgroundColor: "red", borderColor: "red" }} onClick={handleCancel}>Cancel</Button>
                                    </Col></Row>
                                </Form>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        </div>
    );
}
export default MaintenanceNewJob;