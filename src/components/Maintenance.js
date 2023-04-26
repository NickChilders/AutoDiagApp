import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import moment from 'moment';
import { Button, Container, Row, Col, Form, Alert, Table } from "react-bootstrap";
import { UserContext } from "./userContext";
import NavigationBar from "./NavigationBar";
import { MdStarOutline, MdStarRate } from "react-icons/md";

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
  const [singleFilter, setSingleFilter] = useState(false);
  const [doubleFilter, setDoubleFilter] = useState(false);

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
      if (response.ok) {
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
      if (scheduleData) {
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

  const getStars = (avg) => {
    if (avg === 5)
      return (<><MdStarRate /><MdStarRate /><MdStarRate /><MdStarRate /><MdStarRate /></>)
    else if (avg === 4)
      return (<><MdStarRate /><MdStarRate /><MdStarRate /><MdStarRate /><MdStarOutline /></>)
    else if (avg === 3)
      return (<><MdStarRate /><MdStarRate /><MdStarRate /><MdStarOutline /><MdStarOutline /></>)
    else if (avg === 2)
      return (<><MdStarRate /><MdStarRate /><MdStarOutline /><MdStarOutline /><MdStarOutline /></>)
    else if (avg === 1)
      return (<><MdStarRate /><MdStarOutline /><MdStarOutline /><MdStarOutline /><MdStarOutline /></>)
    else if (avg === 0)
      return (<><MdStarOutline /><MdStarOutline /><MdStarOutline /><MdStarOutline /><MdStarOutline /></>)
  }


  const handleCheckboxChange = (event, jobs) => {
    const defaultJobs = [...jobs];
    const isUsefulChecked = document.getElementById("usefulnessCheckbox").checked;
    const isDifficultyChecked = document.getElementById("difficultyCheckbox").checked;
    if (isUsefulChecked && isDifficultyChecked) {
      // both checkboxes are checked
      setDoubleFilter(true);
      setSingleFilter(false);
      setJobs(jobs.sort((a, b) => {
        const usefulDiff = b.ratings.usefulness.average - a.ratings.usefulness.average;
        const diffDiff = a.ratings.difficulty.average - b.ratings.difficulty.average;
        return usefulDiff !== 0 ? usefulDiff : diffDiff;
      }));
    } else if (isUsefulChecked) {
      // only usefulness checkbox is checked
      setDoubleFilter(false);
      setSingleFilter(true);
      setJobs(jobs.sort((a, b) => b.ratings.usefulness.average - a.ratings.usefulness.average));
    } else if (isDifficultyChecked){
      // only difficulty checkbox is checked
      setDoubleFilter(false);
      setSingleFilter(true);
      setJobs(jobs.sort((a, b) => a.ratings.difficulty.average - b.ratings.difficulty.average));
    } else {
      // neither checkbox is checked
      setDoubleFilter(false);
      setSingleFilter(false)
      setJobs(defaultJobs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }
  

  const checkSignIn = ({ user }) => {
    if (!user) {
      return (
        <div>
          <NavigationBar />
          <div className="index_body">
            <section className="section" >
              <div className="box-main" style={{ marginTop: "20px" }}>
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
          <NavigationBar make={make} model={model} year={year} />
          <div className="index_body">
            <section className="section0" style={{ textAlign: "center" }}>
              <div className="box-main" style={{ marginTop: "20px" }}>
                <div className="firstHalf">
                  <h1 className="text-big">
                    Maintenance &emsp;
                    <hr />
                    <div className="box-main">
                      <p style={{ fontSize: 11 }}>
                        See what your car is scheduled for based on the current mileage.
                      </p><Button variant="primary" style={{ margin: "20px", width: "auto", height: "auto" }} onClick={handleScheduleClick}>{"Recommended Maintenance"}</Button>
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
            <hr />
            <section className="section1" style={{ textAlign: "center" }}>
              <div className="box-main">
                <p>Contribute to the community!
                  <br />
                  Add a maintenance procedure for other users to follow.
                </p>
                <Button as={Link} to={`${process.env.PUBLIC_URL}/api/maintenance/job/new`} variant="primary" style={{ margin: "20px", height: "auto", width: "auto" }}>
                  {"Add Your Procedure"}
                </Button>
              </div>
            </section>
            {returned && (
              <section className="section2" style={{ textAlign: "center", }}>
                <hr />
                <Container>
                  <p style={{ fontSize: "small", fontWeight: "normal", textAlign: "left" }}>
                    "Repair Difficulty" is the difficulty rating of a specific maintenance item.<br />
                    &emsp;&emsp;0-1: Most people can do on their own without significant training.<br />
                    &emsp;&emsp;2: Require some degree of skill.<br />
                    &emsp;&emsp;3: Require significant skill and/or experience and is not recommended for casual users.</p>
                  <div>
                    <Table responsive style={{ borderRadius: '20px', overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ backgroundColor: "blue", color: "white" }}>
                          <th colSpan={8}>Here is a comprehensive list of what your vehicle may be scheduled for within +/-10,000 miles of subitted mileage:</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleData && scheduleData.map((item, index) => (
                          <React.Fragment key={index}>
                            <tr style={{ backgroundColor: "blue", color: "white" }}>
                              <th colSpan={8}><u>Description: {item.desc}</u></th>
                            </tr>
                            <tr style={{ backgroundColor: "blue", color: "white" }}>
                              <th>Due Mileage</th>
                              <th>Repair Difficulty</th>
                              <th>Labor Hours</th>
                              <th>Labor Rate per Hour</th>
                              <th>Labor Cost</th>
                              <th>Part Cost</th>
                              <th>Misc Cost</th>
                              <th>Total Cost</th>
                            </tr>
                            <tr>
                              <td>{item.due_mileage}</td>
                              <td>{item.repair.repair_difficulty}</td>
                              <td>{item.repair.repair_hours}</td>
                              <td>{item.repair.total_cost === 0 ? ("-") : (`$${item.repair.labor_rate_per_hour}/hour`)}</td>
                              <td>{item.repair.total_cost === 0 ? ("-") : (`$${item.repair.labor_cost}`)}</td>
                              <td>{item.repair.total_cost === 0 ? ("-") : (`$${item.repair.part_cost}`)}</td>
                              <td>{item.repair.total_cost === 0 ? ("-") : (`$${item.repair.misc_cost}`)}</td>
                              <td>{item.repair.total_cost === 0 ? ("-") : (<u>${item.repair.total_cost}</u>)}</td>
                            </tr>
                            {item.parts && (
                              <React.Fragment>
                                <tr style={{ backgroundColor: "#fabd5a" }}>
                                  <th>Part Description</th>
                                  <th>Part Price</th>
                                  <th>Quantity Needed</th>
                                </tr>
                                {item.parts && item.parts.map((part, i) => (
                                  <React.Fragment key={i}>
                                    <tr>
                                      <td>{part.desc}</td>
                                      <td>{part.price}</td>
                                      <td>{part.qty}</td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <thead>
                        <tr style={{ backgroundColor: "blue", color: "white" }}>
                          <th style={{ fontSize: "small" }} colSpan={8}>Note: The prices shown are averages and may vary depending on location.</th>
                        </tr>
                      </thead>
                    </Table>
                    <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="close" onClick={handleClose}>{"Close"}</Button>
                  </div>
                </Container>
              </section>
            )}
            <section className="section3" style={{ textAlign: "center" }}>
              {!noJobs ? (
                <div className="box-main">
                  <Table className="post-table" striped style={{ whiteSpace: 'nowrap' }} responsive>
                    <thead>
                      <tr style={{ backgroundColor: "blue", color: "white" }}>
                        <th colSpan={5}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span>Maintenance Jobs Users Have Posted</span>
                            <div style={{ marginLeft: "auto", textAlign: 'left' }}>
                              <div>
                                <label>
                                  <input type="checkbox" id="usefulnessCheckbox" value="usefulness" onChange={(e) => handleCheckboxChange(e,jobs)} />Highest Usefulness
                                </label>
                              </div>
                              <div>
                                <label>
                                  <input type="checkbox" id="difficultyCheckbox" value="difficulty" onChange={(e) => handleCheckboxChange(e,jobs)} />Lowest Difficulty
                                </label>
                              </div>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <thead>
                    <tr style={{ backgroundColor: "blue", color: "white" }}>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date Posted</th>
                      <th>Usefulness Rating</th>
                      <th>Difficulty Rating</th>
                    </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td><Link to={`${process.env.PUBLIC_URL}/api/maintenance/job/${job._id}`}>{job.heading}</Link></td>
                            <td>{job.author}</td>
                            <td>{moment(job.date).format('MMM Do YYYY')}</td>
                            <td style={{ textAlign: 'center' }}>{getStars(job.ratings.usefulness.average)}{` (${job.ratings.usefulness.count})`}</td>
                            <td style={{ textAlign: 'center' }}>{getStars(job.ratings.difficulty.average)}{` (${job.ratings.difficulty.count})`}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="box-main">
                  <h4>Unfortunately, there are no maintenance posts yet.</h4>
                </div>
              )
              }
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
