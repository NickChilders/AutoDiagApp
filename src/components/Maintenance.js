import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, ListGroup, ListGroupItem, Row, Col, Form, Alert } from "react-bootstrap";
import { UserContext } from "./userContext";

const Maintenance = () => {
  const { user } = useContext(UserContext);
  const [imgUrl, setImgUrl] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [noJobs, setNoJobs] = useState(true);
  const [viewSchedule, setViewSchedule] = useState(false);
  const [mileage, setMileage] = useState('');
  const [milesError, setMilesError] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const [returned, setReturned] = useState(false);

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

  const fetchJobs = async (make, model, year) => {
    try {
      const response = await fetch(`http://localhost:3001/api/maintenance/job/?vehicleMake=${make}&vehicleModel=${model}&vehicleYear=${year}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        setNoJobs(false);
      }
    } catch (error) {
      console.error('Error fetching maintenance jobs', error);
    }
  };

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
    fetchJobs(make, model, year)
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

  const handleScheduleClick = (event) => {
    event.preventDefault();
    setViewSchedule(true);
  }

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://api.carmd.com/v3.0/maint?vin=${vin}&mileage=${mileage}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${process.env.REACT_APP_MD_AUTH_KEY}`,
          "Partner-Token": `${process.env.REACT_APP_MD_PARTNER_KEY}`
        }
      })
      const data = await response.json();
      if(response.ok){
        setScheduleData(data.data);
        setMilesError('');
      }
    }
    catch (error) {
      setMilesError(error);
    }
  }

  const handleViewSchedule = async (event) => {
    event.preventDefault();
    if (scheduleData)
      setScheduleData([])
    const numMileage = parseInt(mileage);
    if (!numMileage || isNaN(numMileage)) {
      setMilesError('Mileage must be a number');
    }
    else {
      await fetchSchedule();
      if(scheduleData){
        setReturned(true);
        setViewSchedule(false);
      }
    }
  }

  const handleCancel = (event) => {
    // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
    event.preventDefault();
    //  Close the form.
    setMileage(0)
    setMilesError('')
    setViewSchedule(false);
  }
  const handleClose = (event) => {
    // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
    event.preventDefault();
    //  Close the form.
    setMileage(0)
    setReturned(false);
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
                    Maintenance &emsp;
                  </h1>
                </div>
              </div>
            </section>
            <div className="box-main" >
              <div className="secondHalf">
                <p className="text-small">
                  You no longer need to be an expert to know how to perform your car maintenance.
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
          <div className="index_body">
            <section className="section">
              <div className="box-main">
                <div className="firstHalf">
                  <h1 className="text-big">
                    Maintenance &emsp;
                    <div>
                      <input type="text" name="search" id="search" placeholder="(Ex: Oil Change)" />
                      <Button className="btn btn-sm" type="search" style={{ margin: "20px", height: "auto", width: "auto" }}>{"Search"}</Button>
                    </div>
                    <div className="box-main">
                      <p style={{ fontSize: 11 }}>
                        See what your car is scheduled for based on the current mileage.
                      </p><Button variant="primary" style={{ margin: "20px", width: "auto", height: "auto" }} onClick={handleScheduleClick}>Maintenance Schedule</Button>
                    </div>
                  </h1>
                </div>
              </div>
            </section>
            {viewSchedule && (
              <Container>
                <div className="view-schedule-form">
                  {milesError && <Alert variant="danger">{milesError}</Alert>}
                  <Form style={{ margin: "20px" }} onSubmit={handleViewSchedule}>
                    <Form.Label>Please enter the current mileage for your {make} {model}</Form.Label>
                    <input type="number" className="form-control" name="mileage" onChange={(e) => { setMileage(e.target.value) }} />
                    <Row>
                      <Col>
                        <div className='btn-group'>
                          <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="submit">{"Submit"}</Button>
                          <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="cancel" onClick={handleCancel}>{"Cancel"}</Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Container>
            )}
            {returned && (
              <section>
                <Container>
                  <div className="box-main">
                    <Form style={{ margin: "20px" }}>
                      <Form.Label>Here is what your vehicle is scheduled for within +/-10,000 miles of subitted mileage:</Form.Label>
                        {scheduleData && scheduleData.map((item, index) => (
                          <div key={index}>
                            <Row><Col>
                            <h2>{item.desc}</h2>
                            <p>Due mileage: {item.due_mileage}</p>
                            <p>Due km: {item.due_km}</p>
                            <p>Is OEM: {item.is_oem ? 'Yes' : 'No'}</p>
                            <p>Repair difficulty: {item.repair.repair_difficulty}</p>
                            <p>Labor hours: {item.repair.repair_hours}</p>
                            <p>Labor rate per hour: {item.repair.labor_rate_per_hour}</p>
                            <p>Part cost: {item.repair.part_cost}</p>
                            <p>Labor cost: {item.repair.labor_cost}</p>
                            <p>Misc cost: {item.repair.misc_cost}</p>
                            <p>Total cost: {item.repair.total_cost}</p>
                            <ListGroup>
                              {item.parts && item.parts.map((part, i) => (
                                <ListGroupItem key={i}>
                                  <p>Part description: {part.desc}</p>
                                  <p>Manufacturer: {part.manufacturer}</p>
                                  <p>Price: {part.price}</p>
                                  <p>Quantity: {part.qty}</p>
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                            <hr />
                            </Col></Row>
                          </div>
                        ))}
                      <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="close" onClick={handleClose}>{"Close"}</Button>
                    </Form>
                  </div>
                </Container>
              </section>
            )}
            <section>
              {!noJobs ? (
                <div>
                  <ListGroup>
                    <hr />
                    {jobs.map((job, index) => (
                      <ListGroupItem key={index}>
                        <Link to={`${process.env.PUBLIC_URL}/api/maintenance/job/${job._id}`}>
                          <h6>{job.heading}</h6>
                        </Link>
                        <p style={{ fontSize: 12 }}>Posted by: {job.author}</p>
                        <p style={{ fontSize: 11, marginTop: -20 }}>Date: {job.date}</p>
                      </ListGroupItem>
                    ))}
                    <hr />
                  </ListGroup>
                </div>
              ) : (
                <div className="box-main">
                  <h4>Unfortunately, there are no maintenance posts yet.</h4>
                </div>
              )
              }
            </section>
            <section>
              <Button as={Link} to={`${process.env.PUBLIC_URL}/api/maintenance/job/new`} variant="primary" style={{ margin: "20px", height: "auto", width: "auto" }}>
                {"Add Procedure"}
              </Button>
            </section>
          </div>
        </div>
      )
    }
  }
  return (
    checkSignIn({ user })
  );
};

export default Maintenance;
