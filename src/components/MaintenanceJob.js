import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from "react-router-dom";
import { UserContext } from './userContext';
import { ListGroup, ListGroupItem, NavLink } from 'react-bootstrap';
import { MdArrowRight } from 'react-icons/md'
import ReactStars from "react-rating-stars-component";
import NavigationBar from './NavigationBar';

const MaintenanceJob = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [header, setHeader] = useState('');
  const [steps, setSteps] = useState([]);
  const [author, setAuthor] = useState('')
  const [date, setDate] = useState('');
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/maintenance/job/${id}`);
        const data = await response.json()
        setHeader(data.heading);
        setSteps(data.steps);
        setAuthor(data.author);
        setDate(data.date);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJob();
  }, [id]);

  if (!steps && !header && !author) {
    return <div>Loading...</div>;
  }

  const sendPostRating = async (rating, ratingType) => {
    try {
      const response = await fetch(`http://localhost:3001/api/maintenance/job/${id}?type=${ratingType}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          rating: rating
        })
      });
      const data = await response.json()
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const diffRatingChanged = (newRating) => {
    const ratingType = 'difficulty';
    console.log(newRating);
    sendPostRating(newRating, ratingType);
  };

  const usefulRatingChanged = (newRating) => {
    const ratingType = 'usefulness';
    console.log(newRating);
    sendPostRating(newRating, ratingType);
  };

  return (
    <div>
      <NavigationBar make={make} model={model} year={year} />
      <NavLink eventkey="3" style={{ display: "inline-block" }} as={Link} to={`${process.env.PUBLIC_URL}/maintenance`} href={`${process.env.PUBLIC_URL}/maintenance`}><u style={{ color: "blue" }}>Maintenance</u></NavLink><MdArrowRight /><b>{header}</b>
      <section>
        <div className='box-main' style={{ marginTop: "20px" }}>
          <h1><u>{header}</u></h1>
        </div>
        <p>Author: {author}</p>
        <p style={{ fontSize: 11 }}>Posted on: {Date(date)}</p>
      </section>
      <hr />
      <div className='box-main'>
        <ListGroup as="ul" numbered>
          {steps.map((step, index) => (
            <ListGroupItem key={index} style={{ fontWeight: "bold" }}>
              {step.description}
              {step.imageUrl && (
                <div style={{ textAlign: "right" }}>
                  <img src={step.imageUrl} width="300" height="200" alt="windshield cleaning" />
                </div>
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
      <div className='box-main'>
        Useful: &emsp;&emsp;<ReactStars count={5} onChange={usefulRatingChanged} size={24} isHalf={false} activeColor="#ffd700" />
      </div>
      <div className='box-main'>
        Difficulty: &emsp;<ReactStars count={5} onChange={diffRatingChanged} size={24} isHalf={false} activeColor="#ffd700" />
      </div>
    </div>
  );
};

export default MaintenanceJob;