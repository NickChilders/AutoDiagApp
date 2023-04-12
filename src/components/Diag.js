import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Container, Form } from 'react-bootstrap';
import { UserContext } from './userContext';
import { Pie } from 'react-chartjs-2'
import ChartDataLabelsPlugin from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import Chart from 'chart.js/auto';

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
  const [diagSearch, setDiagSearch] = useState(false);
  const [symptom, setSymptom] = useState('');
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFix, setSearchFix] = useState("");
  const [chartData, setChartData] = useState(null);
  const [options, setOptions] = useState({});
  const [displayChart, setDisplayChart] = useState(false);
  const [noData, setNoData] = useState(false);
  const [addFixForm, setAddFixForm] = useState(false);
  const [availFixes, setAvailFixes] = useState([]);
  const [noFixes, setNoFixes] = useState(false);
  const [solution, setSolution] = useState('');
  const [thanks, setThanks] = useState(false);

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

  useEffect(() => {
    const fetchSymptoms = async () => {
      const response = await fetch(`http://localhost:3001/api/diag/symptoms/all?vehicleMake=${make}&vehicleModel=${model}&vehicleYear=${year}`);
      if (response.ok) {
        const resData = await response.json();
        setAllSymptoms(resData);
        setFilteredSymptoms(resData);
      } else {
        console.log("ERROR: Something went wrong getting symptom data.");
      }
    };
    fetchSymptoms();
  }, [make, model, year]);

  const handleAlert = () => {
    alert(`${process.env.REACT_APP_DIAG_DISCLAIMER}`)
  }

  const handleSearch = (event) => {
    setAddFixForm(false);
    setSymptom(event.target.value);
    setSearchTerm(event.target.value);
    if (event.target.value === "")
      setFilteredSymptoms([]);
    else {
      const filtered = allSymptoms.filter((s) =>
        s.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    }
  };
  const handleFixSearch = (event) => {
    setSymptom(event.target.value);
    setSearchTerm(event.target.value);
    if (event.target.value === "")
      setFilteredSymptoms([]);
    else {
      const filtered = allSymptoms.filter((s) =>
        s.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    }
  }
  /*************************************************************************\
  *   Desc.:  Once clicked, the user can search symptoms for a diagnosis.
  * ************************************************************************/
  const handleClickSearch = async (event) => {
    event.preventDefault();
    setThanks(false);
    setNoData(false);
    setDisplayChart(false);
    setDiagSearch(true);
    setSearchTerm('');
    setSearchFix('');
  }

  /********************************************************************************\
  *   Desc.:  Handles when the user clicks the 'Cancel' Button
  *********************************************************************************/
  const handleCancel = (event) => {
    // Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
    event.preventDefault();
    //  Close the forms.
    setDiagSearch(false);
    setAddFixForm(false);
    setSolution('');
    setSearchTerm('');
    setSearchFix('');
  }

  const getAFix = async (symptom) => {
    const response = await fetch(`http://localhost:3001/api/diag/symptoms?vehicleMake=${make}&vehicleModel=${model}&vehicleYear=${year}&symptom=${symptom}`)
    const data = await response.json()
    return data;
  }

  const handleGetDiag = async (event) => {
    //  Prevents the default behavior of the event, which is to refresh the page when the button is clicked.
    event.preventDefault();
    //Returns a symptom and a fix with percentages
    const data = await getAFix(symptom)
    const fixesData = []
    if (data.length > 0) {
      data.forEach((fix) => {
        fixesData.push({ label: fix.fix, data: fix.percentage })
      })
      //  Close the form to search symptoms.
      setDiagSearch(false)
      const chartData = {
        labels: fixesData.map((fix) => fix.label),
        datasets: [
          {
            data: fixesData.map((fix) => parseFloat(fix.data)),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
          },
        ],

      };
      const opts = {
        plugins: {
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold'
            },
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });
              let percentage = '';
              if (sum === 0)
                percentage = '0%'
              else
                percentage = (parseFloat(value) * 100 / sum).toFixed(2) + "%";
              return percentage;
            }
          }
        }
      };
      // Register the plugin
      Chart.register(ChartDataLabelsPlugin);
      setOptions(opts);
      setDisplayChart(true);
      setChartData(chartData);
      setDiagSearch(false)
      setSearchTerm('');
    }
    else {
      setDisplayChart(false)
      setNoData(true);
      setDiagSearch(false)
      setSearchTerm('');
    }
  }

  const handleAddFixClick = (event) => {
    event.preventDefault();
    setThanks(false);
    setDisplayChart(false);
    setNoData(false);
    setAddFixForm(true);
    setSearchTerm('');
    setSearchFix('');
  }

  const handleFixCheck = async (event) => {
    event.preventDefault();
    const data = await getAFix(symptom)
    const fixesData = []
    if (data.length > 0) {
      data.forEach((fix) => {
        fixesData.push(fix.fix)
      })
      setAvailFixes(fixesData);
    }
    else
      setNoFixes(true);
  }

  const handleAddFix = async (event) => {
    event.preventDefault();
    const data = localStorage.getItem('userData')
    const parsedData = JSON.parse(data);
    const response = await fetch(`http://localhost:3001/api/diag/symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user': `${parsedData.username}`
      },
      body: JSON.stringify({
        vehicleMake: make,
        vehicleModel: model,
        vehicleYear: year,
        symptom: symptom,
        fix: solution
      })
    })
    if (response.ok) {
      setSolution('')
      setSearchFix('')
      setSearchTerm('')
      setAddFixForm(false)
      setThanks(true)
    }
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
            <div className="box-main">
              <Button style={{ width: "auto", height: "auto", margin: "20px", }} variant="primary" type="search" onClick={(e) => { handleAlert(e); handleClickSearch(e); }}>{"Diagnose Symptoms"}</Button>
              <Button style={{ width: "auto", height: "auto", margin: "20px", backgroundColor: "orange", borderColor: "orange" }} variant="primary" onClick={handleAddFixClick}>{"Submit Solution"}</Button>
            </div>
            {diagSearch && (
              <Container>
                <div className="diag-search-form">
                  <Form style={{ margin: "20px" }} onSubmit={handleGetDiag}>
                    <Form.Label>Search or select a symptom.</Form.Label>
                    <Row>
                      <Col>
                        <Form.Label>
                          Enter symptom:
                          <p style={{ fontSize: "10px" }}>(Some symptoms may not have results. This may be because other users have not input the symptom and solution.)</p>
                          <input type="text" className="form-control" list="symptoms" value={searchTerm} onChange={(e) => handleSearch(e)} />
                          <datalist id="symptoms">
                            <option>Select the best match</option>
                            {filteredSymptoms.map((s, index) => (
                              <option key={index} value={s}>
                                {s}
                              </option>
                            ))}
                          </datalist>
                        </Form.Label>
                      </Col>
                    </Row>
                    <div className='btn-group'>
                      <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="submit">{"Search"}</Button>
                      <Button style={{ width: "auto", height: "auto", margin: "20px" }} variant="primary" type="cancel" onClick={handleCancel}>{"Cancel"}</Button>
                    </div>
                  </Form>
                </div>
              </Container>
            )}
          </div>
          <section>
            {noData && !displayChart && (
              <>
                <h3>{`Unfortunately, there is no diagnostic data for '${symptom}'`}</h3>
                <h5>When you solve your issue, we ask that you input what worked to help other users.</h5>
              </>
            )}
          </section>
          <section>
            {displayChart && (
              <>
                <h3>{`Diagnostics for: ${symptom}`}</h3>
                <div className="box-main">
                  <div id="myChartContainer" className="chart-container">
                    <Pie data={chartData} options={options} />
                  </div>
                </div>
              </>
            )}
            {addFixForm && (
              <Container>
                <div className="add-fix-form">
                  <Form style={{ margin: "20px" }} onSubmit={handleAddFix}>
                    <Form.Label>Congrats on fixing your car trouble!</Form.Label>
                    <br />
                    <Form.Label>Let's help others who may also run into your issue.</Form.Label>
                    <br />
                    <br />
                    <Row>
                      <Col>
                        <Form.Label>Briefly state what your main symptom was:</Form.Label>
                      </Col>
                    </Row>
                    <input type="text" className="form-control" list="symptoms" value={searchTerm} onChange={(e) => handleFixSearch(e)} />
                    <datalist id="symptoms">
                      <option>Select the best match</option>
                      {filteredSymptoms.map((s, index) => (
                        <option key={index} value={s}>{s}</option>
                      ))}
                    </datalist>
                    <br />
                    {!noFixes ? (
                      <>
                        <Form.Label>You may choose to select a solution, or provide a new one.</Form.Label>
                        <input type="text" className="form-control" list="solutions" value={searchFix} onChange={(e) => { handleFixCheck(e); setSearchFix(e.target.value); setSolution(e.target.value) }} />
                        <datalist id="solutions">
                          {availFixes.map((fix, index) => (
                            <option key={index} value={fix}>{fix}</option>
                          ))}
                        </datalist>
                      </>
                    ) : (
                      <>
                        <Form.Label>Briefly state what your solution was.</Form.Label>
                        <input type="text" className="form-control" value={searchFix} onChange={(e) => { setSearchFix(e.target.value) }} />
                      </>
                    )}
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
            {thanks && (
              <div className="box-main">
                <h3>Thank you for submitting a solution!</h3>
              </div>
            )}
            <div className="box-main">
              <p>When you solve your issue, we ask that you input what worked to help other users.</p>
              <br />
              <br />
            </div>
          </section>
        </div >
      )
    }
  }


  return (
    checkSignIn({ user })
  );
};

export default Diagnostics;
