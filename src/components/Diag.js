import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from 'react-router-dom';
import { Button, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { UserContext } from './userContext';

const Diagnostics = () => {
  const { user } = useContext(UserContext);
  const [imgUrl, setImgUrl] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [obd, setObd] = useState('');
  const [obdDefinition, setObdDefinition] = useState('');
  const [obdCause, setObdCause] = useState([]);
  const [searchedObd, setSearchedObd] = useState('');
  const [obdSuccess, setObdSuccess] = useState(false);
  const [obdError, setObdError] = useState(false)

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

  const handleSearchAlert = (searchParams) => {
    let disclaimer = require('./../TesterFiles/Disclaimers.json')
    alert(`${disclaimer.Diag}`)
  }

  const getCodeInfo = async (code) => {
    const url = `https://car-code.p.rapidapi.com/obd2/${code}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_KEY}`,
        'X-RapidAPI-Host': `${process.env.REACT_APP_RAPID_HOST}`
      }
    })
    if (response.ok) {
      const responseData = await response.json();
      setObdDefinition(responseData.definition);
      setObdCause(responseData.cause);
      setObdSuccess(true)
    }
    else {
      setObdError(true);
    }

  }

  const handleObdSearch = () => {
    setSearchedObd(obd);
    getCodeInfo(obd)
  }
  const handleYes = () => {
    setObdError(false);
    if (obdSuccess)
      setObdSuccess(false);
    setObd('');
  }

  const checkSignIn = ({ user }) => {
    if (!user) {
      return (
        <div>
          <div className="index_body">
            <section className="section" >
              <div className="box-main" >
                <div className="firstHalf">
                  <h1 className="text-big">
                    Diagnostics &emsp;
                  </h1>
                </div>
              </div>
            </section>
            <div className="box-main" >
              <div className="secondHalf">
                <p className="text-small">
                  You no longer need to be an expert to properly diagnose your car with confidence.
                </p>
                <p>
                  Please &nbsp;
                  <NavLink eventkey="0" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}>Sign In</NavLink>
                  &nbsp; or &nbsp;
                  <NavLink eventkey="1" as={Link} to={`${process.env.PUBLIC_URL}/register`} href={`${process.env.PUBLIC_URL}/register`}>Register</NavLink>
                  &nbsp; To Continue.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-sm btn-group" type="search" style={{ height: "auto", width: "auto" }} onClick={(e) => (handleSearchAlert(e))}><u style={{ fontSize: 18, color: "blue" }}>{'Search'}</u></button><input type="text" name="search" id="search" placeholder="(Ex: Car misfire)" />
          </div>
          <div className="index_body">
            <section className="section" >
              <div className="box-main" >
                <div className="firstHalf">
                  <h1 className="text-big">
                    Diagnostics &emsp;
                  </h1>
                  <p>Currently diagnosing your {year} {make} {model}</p>
                </div>
              </div>
            </section>
            <div className="box-main">
              {!obdSuccess && (
                <div className="firstHalf">
                  <input type="text" name="search" id="search" placeholder="(Ex: P0001)" value={obd} onChange={(event) => setObd(event.target.value)} />
                  <Button className="btn btn-large btn-group" type="submit" style={{ margin: "10px", height: "auto", width: "auto" }} onClick={handleObdSearch}>{'CEL Code'}</Button>
                </div>
              )}
            </div>
            {obdSuccess && (
              <>
                <div className="box-main">
                  {obdError ? (
                    <>
                      {`${process.env.REACT_APP_OBD_RESPONSE_FAIL}`}
                    </>
                  ) : (
                    <h4>Code: {searchedObd}</h4>
                  )}
                </div>
                <div className="box-main">
                  <h5>Meaning: {obdDefinition}</h5>
                </div>
                <div className="box-main">
                  <h6><u>Possible Causes</u>:</h6>
                </div>
                <div className="box-main">
                  <Row>
                    <Col>
                      <ListGroup as="ol" className="numbered-list">
                        {obdCause.map((cause, index) => (
                          <Row key={index}>
                            <Col>
                              <ListGroup.Item as="li" key={index}>{cause}</ListGroup.Item>
                            </Col>
                          </Row>
                        ))}
                      </ListGroup>
                    </Col>
                  </Row>
                </div>
                <div className="box-main">
                  Search Another Code?
                  <Button className="btn btn-sm btn-group" type="submit" style={{ margin: "20px", height: "auto", width: "auto" }} onClick={handleYes}> {'Yes'}</Button>
                </div>
              </>
            )}

          </div>
        </div >
      )
    }
  }


  return (
    checkSignIn({ user })
  );
};

export default Diagnostics;
