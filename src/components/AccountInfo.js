import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './userContext';
import { MdArrowForward } from "react-icons/md";
import { Row, Col, Button, Container, Form, Alert, ListGroup,ListGroupItem } from 'react-bootstrap';

const AccountInfo = () => {
    const { user } = useContext(UserContext);
    const [imgUrl, setImgUrl] = useState('');
    const [vin, setVin] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicles, setVehicles] = useState([]);
    const [add, setAdd] = useState(false);
    const [newVin, setNewVin] = useState('');
    const [successful, setSuccessful] = useState('');
    const [addError, setAddError] = useState('');

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

    // Once clicked, the user can add a vehicle by entering information.
    const handleClickAdd = async (event) => {
        event.preventDefault();
        setAdd(true);
    }

    /**********************************************************************************\
        Desc.:  This function adds a vehicle to a user's vehicles array in the server.
        Input:  usr: username (required)
                vin: vin number (required).
                make: make of the vehicle (required).
                model: model of the vehicle (required).
                year: year of the vehicle (required).
    ***********************************************************************************/
    const addUserVehicle = async (usr, vin, make, model, year) => {
        //  Construct the request options for a POST request to the server
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": usr,
                "vehicleVIN": vin,
                "vehicleMake": make,
                "vehicleModel": model,
                "vehicleYear": year
            })
        };
        //  Define the URL to fetch with the request Options.
        const url = `http://localhost:3001/user/vehicle/`;
        try {
            //  Post the information the server using fetch().
            const response = await fetch(url, requestOptions);
            //  If response is 400. Username and/or vehicle information was not included with the request.
            if (response.status === 400) {
                throw new Error("Please provide a username and vehicle information.");
            }
            //  If response is 404. The server could not find the user.
            else if (response.status === 404) {
                throw new Error(`Sorry for the inconvenience. There was a problem adding VIN#:${vin} to ${usr}. We will investigate the issue and you may try again.`);
            }
            // Grab the response in JSON format then set a success message to be displayed.
            const data = await response.json();
            setSuccessful('Successfully added a vehicle. You may need to refresh the page.')
            // Update vehicles array with the new vehicle
            setVehicles([...vehicles, {
                mainVehicle: data.mainVehicle,
                vehicleVIN: data.vehicleVIN,
                vehicleMake: data.vehicleMake,
                vehicleModel: data.vehicleModel,
                vehicleYear: data.vehicleYear,
                vehicleImgUrl: data.vehicleImgUrl
            }]);
            //Catch an error and then set an error message to be displayed.
        } catch (error) {
            console.error(error)
            setAddError(error.message)
        }
    }

    /**************************************************************************\
        Desc.:  This function fetches vehicle information from the server.
                Then calls the addUserVehicle function with the returned data.
        Input:  usr: username (required)
                vin: vin number of the desired vehicle. (required).
    ***************************************************************************/
    const fetchVehicleInfo = async (usr, vin) => {
        let url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended/${vin}?format=json`;
        const response = await fetch(url);
        const data = await response.json();
        const make = data.Results[7].Value;
        const model = data.Results[9].Value;
        const year = data.Results[10].Value;
        await addUserVehicle(usr, vin, make, model, year);
    };

    /********************************************************************************\
        Desc.:  Handles when the user clicks the 'Click To Add A New Vehicle' Button
    *********************************************************************************/
    const handleNewVehicle = async (event) => {
        // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
        event.preventDefault();
        //  Fetch the vehicle information.
        //  This function will also call the addUserVehicle function.
        await fetchVehicleInfo(user.username, newVin);
        //  Close the form to add a vehicle.
        setAdd(false)
    }

    /********************************************************************************\
        Desc.:  Handles when the user clicks the 'Cancel' Button
    *********************************************************************************/
    const handleCancel = (event) => {
        // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
        event.preventDefault();
        //  Close the form to add a vehicle.
        setAdd(false)
    }

    /*************************************************************************************************\  
        Desc.:  Handles when the user clicks the 'Next' Button.
                Once clicked, the next element in the vehicles array will be set as the main vehicle.
    ***************************************************************************************************/
    const handleClickNext = async (event) => {
        // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
        event.preventDefault();
        // Calculate the index of the next vehicle in the array, OR reset to the first vehicle if at the end of the array.
        const newIndex = currentIndex === vehicles.length - 1 ? 0 : currentIndex + 1;
        // Set the current index to the new index.
        setCurrentIndex(newIndex);
        // Set various pieces of vehicle information using the data for the new index in the vehicles array.
        setVin(vehicles[newIndex].vehicleVIN);
        setImgUrl(vehicles[newIndex].vehicleImgUrl);
        setMake(vehicles[newIndex].vehicleMake);
        setModel(vehicles[newIndex].vehicleModel);
        setYear(vehicles[newIndex].vehicleYear);
        // Send a PUT request to update the user's main vehicle with the vehicle VIN for the new index.
        await fetch(`http://localhost:3001/users/${user.token}/main-vehicle/${vehicles[newIndex].vehicleVIN}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            // Convert the response to JSON and log the data to the console.
            .then((response) => response.json())
            .then((data) => console.log(data))
            // If an error occurs, log the error to the console.
            .catch((error) => console.log(error));
    };

    /**********************************************************************************\
        Desc.:  This function deletes a vehicle from a user's vehicles array in the server.
        Input:  token: user's token (required)
                vin: vin number (required).
    ***********************************************************************************/
    const deleteUserVehicle = async (token, vin) => {
        // Construct the request options for a POST request to the server
        const requestOptions = {
            method: 'DELETE',
        };

        // Define the URL to fetch with the request Options.
        const url = `http://localhost:3001/users/${token}/remove-vehicle/${vin}`;
        try {
            // Post the information the server using fetch().
            const response = await fetch(url, requestOptions);

            // Handle different response statuses
            if (response.status === 400) {
                throw new Error('Must have at least one vehicle registered!');
            } else if (response.status === 401) {
                throw new Error(
                    `Sorry for the inconvenience. There was a problem removing VIN#: ${vin}. We will investigate the issue and you may try again later.`
                );
            }

            // If the delete request is successful, update the vehicles state
            const newVehicles = vehicles.filter((vehicle) => vehicle.vehicleVIN !== vin);
            setVehicles(newVehicles);

            // Grab the response in JSON format then set a success message to be displayed.
            const data = await response.json();
            setSuccessful(`${data.message}. You may need to refresh the page.`);
        } catch (error) {
            // Catch an error and then set an error message to be displayed.
            console.error(error);
            setAddError(error.message);
        }
    };


    const handleClickDelete = async (event) => {
        // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
        event.preventDefault();
        // Display a confirmation dialog to the user
        const confirmDelete = window.confirm("Are you sure you want to remove this vehicle?");

        // If the user clicks "OK" on the confirmation dialog, proceed with the delete request
        if (confirmDelete) {
            // Retrieve the userData object from localStorage and parse it to a JavaScript object
            const userData = JSON.parse(localStorage.getItem('userData'));
            deleteUserVehicle(userData.token, vehicles[currentIndex].vehicleVIN);
        }
    }

    return (
        <div>
            <div className="index_body">
                <section className="section0" style={{textAlign: "center"}}>
                    <div className="box-main">
                        <div className="firstHalf">
                            <Row>
                                <Col>
                                    <h1 className="text-big">
                                        <div>
                                            {user && user.username} Account Information &emsp;
                                        </div>
                                    </h1>
                                </Col>
                            </Row>
                            {vehicles.length > 1 && (
                                <Row>
                                    <Col>
                                        <div>
                                            Want to Switch vehicles?
                                            <Button style={{ width: "auto", height: "auto", margin: "20px", }} variant="primary" type="next" onClick={handleClickNext}>{" "}<MdArrowForward />{" "}</Button>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                            <Row style={{ display: "flow-root" }}>
                                <Col>
                                    <div style={{ display: "inline-block" }}>
                                        <Row>
                                            <Button style={{ width: "auto", height: "auto", margin: "10px", }} variant="primary" type="add" onClick={handleClickAdd}>{"Add Vehicle"}</Button>
                                            <Button style={{ width: "auto", height: "auto", margin: "10px", backgroundColor: "red", borderColor: "red" }} color="red" variant="primary" type="delete" onClick={handleClickDelete}>{"Remove Vehicle"}</Button>
                                        </Row>
                                        {add && (
                                            <Container>
                                                <div className='add-vehicle-form'>

                                                    <Form style={{ margin: "20px" }} onSubmit={handleNewVehicle}>
                                                        <Row>
                                                            <Col>
                                                                <Form.Label>
                                                                    Vehicle VIN:
                                                                    <input type="text" className="form-control" placeholder="#################" value={newVin} onChange={(e) => setNewVin(e.target.value)} />
                                                                </Form.Label>
                                                            </Col>
                                                        </Row>
                                                        <div className='btn-group'>
                                                            <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="submit">{"Add"}</Button>
                                                        </div>
                                                        <div>
                                                            <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="cancel" onClick={handleCancel}>{"Cancel"}</Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </Container>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: "flow-root" }}>
                                <Col>
                                    {addError && <Alert variant="danger">{addError}</Alert>}
                                    {successful && <Alert>{successful}</Alert>}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </section>
                <section className="section1">
                    <div className='box-main'>
                        <img src={imgUrl} width="auto" height="250" alt="users car" />
                    </div>
                </section>
                <section className="section2" style={{textAlign: "left"}}>
                    <div className="box-main">
                        <ListGroup>
                            <ListGroupItem><b>Vehicle VIN:</b> &emsp;{vin}</ListGroupItem>
                            <ListGroupItem><b>Vehicle Make:</b> &emsp;{`${make}`}</ListGroupItem>
                            <ListGroupItem><b>Vehicle Model:</b> &emsp;{`${model}`}</ListGroupItem>
                            <ListGroupItem><b>Vehicle Year:</b> &emsp;{year}</ListGroupItem>
                        </ListGroup>
                    </div>
                </section>
            </div>
        </div>
    );
};
export default AccountInfo;