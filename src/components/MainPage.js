import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cel from "../images/CEL.png";
import maint from "../images/Maint.png";
import forums from "../images/Forums.png";
import logo from "../images/ADLOGO.png";
import { UserContext } from './userContext';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

const MainPage = () => {
    const { user } = useContext(UserContext);
    const [imgUrl, setImgUrl] = useState('');
    const [vin, setVin] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicles, setVehicles] = useState([]);

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

    const checkSignIn = ({ user }) => {
        if (!user) {
            return (
                [
                    <NavigationBar />,
                    <section className='section 0' style={{ backgroundColor: "black", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className='box-main'>
                            <h1 style={{ color: "#F6AD15" }}><u>AUTO</u>  <img src={logo} style={{ width: "25%", height: "auto", verticalAlign: "middle" }} />  <u>DIAG</u></h1>
                        </div>
                    </section>,
                    <section className="section1" key="section0" style={{ textAlign: "center" }}>
                        <div className="box-main">
                            <div className="firstHalf"></div>
                            <h1 className="text-big" style={{ marginTop: "20px" }}>Welcome to AutoDiag!</h1>
                        </div>
                        <div>Please &nbsp;
                            <NavLink eventkey="0" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}>Sign In</NavLink>
                            &nbsp; or &nbsp;
                            <NavLink eventkey="1" as={Link} to={`${process.env.PUBLIC_URL}/register`} href={`${process.env.PUBLIC_URL}/register`}>
                                Register
                            </NavLink>
                            &nbsp; To Continue.
                        </div>
                        <div className="box-main">
                            <div className="secondHalf">
                                <h2 className="text-big" id="program" style={{ marginTop: "100px" }}>My Car</h2>
                                <div></div>
                                <p className="text-small">
                                    Track everything for your car. Year, Make, Model, Miles, MPG, etc.<br />
                                    All information needed to keep you and your car safe.
                                    No more sifting through endless searches.
                                </p>
                            </div>
                        </div>
                    </section>
                ]
            )
        }
        else {
            return (
                [
                <NavigationBar make={make} model={model} year={year} />,
                <div>
                    <section className='section 0' style={{ backgroundColor: "black", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className='box-main'>
                            <h1 style={{ color: "#F6AD15" }}><u>AUTO</u>  <img src={logo} style={{ width: "25%", height: "auto", verticalAlign: "middle" }} />  <u>DIAG</u></h1>
                        </div>
                            <h6 style={{ color: "#F6AD15" }}><u>Welcome back {` ${user.username}`}!</u></h6>
                    </section>,
                    <section className="section1" key="section1" style={{ textAlign: "center" }}>
                        <div className="box-main">
                            <div className="firstHalf">
                                <p></p>
                                <br />
                                <h2 className="text-big" ><u>Diagnostics</u></h2>
                                <p className="text-small">Diagnose your car with confidence.</p>
                                <Link to={`${process.env.PUBLIC_URL}/diagnostics`}><img src={cel} width="auto" height="90" alt="diagnostics link" /></Link>
                            </div>
                        </div>
                        <hr />
                        <div className="box-main">
                            <div className="secondHalf">
                                <h2 className="text-big" id="program"><u>Maintenance</u></h2>
                                <p className="text-small">No need to worry about finding the correct information. All necessary maintenance for YOUR car.</p>
                                <Link to={`${process.env.PUBLIC_URL}/maintenance`}><img src={maint} width="auto" height="125" alt="maintenance link" /></Link>
                            </div>
                        </div>
                        <hr />
                        <div className="box-main">
                            <div className="secondHalf">
                                <h2 className="text-big" id="program"><u>Forums</u></h2>
                                <p className="text-small">Browse the forums for everything related to YOUR car's year, make, and model.</p>
                                <Link to={`${process.env.PUBLIC_URL}/forums`}><img src={forums} width="auto" height="200" alt="forums link" /></Link>
                            </div>
                        </div>
                        <hr />
                        <div className="box-main">
                            <div className="secondHalf">
                                <h2 className="text-big" id="program"><u>My Car</u>:</h2>
                                <ListGroup style={{ textAlign: "left" }}>
                                    <ListGroupItem><b>Make:</b> {make}</ListGroupItem>
                                    <ListGroupItem><b>Model:</b> {model}</ListGroupItem>
                                    <ListGroupItem><b>Series:</b> {year}</ListGroupItem>
                                </ListGroup>
                            </div>
                        </div>
                        <hr />
                    </section>
                    </div>
                ]
            )
        }
    }

    return (
        checkSignIn({ user })
    );
};

export default MainPage;