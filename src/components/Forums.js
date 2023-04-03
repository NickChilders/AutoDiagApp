import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { UserContext } from './userContext';
import PostPreview from "./PostPreview";

const Forums = () => {
  const { user } = useContext(UserContext);
  const [imgUrl, setImgUrl] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);

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
    const data = localStorage.getItem('userData')
    const parsedData = JSON.parse(data);
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'user': `${parsedData.username}`
          }
        });
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = localStorage.getItem('userData')
    const parsedData = JSON.parse(data);
    const response = await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title,
        content,
        author: parsedData.username,
        vehicleMake: make,
        vehicleModel: model,
        vehicleYear: year
      })
    });

    if (response.ok) {
      const data = await response.json();
      const newPosts = Array.isArray(posts) ? [...posts, data] : [data];
      setPosts(newPosts);
      setTitle('');
      setContent('');
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById('search');
    if (!searchInput) {
      console.log('Search input not found!');
      return;
    }
    const searchValue = searchInput.value;
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPosts(filteredPosts);
  };

  const checkSignIn = ({ user }) => {
    if (!user) {
      return (
        <div>
          <div className="index_body">
            <section className="section" >
              <div className="box-main" >
                <div className="firstHalf">
                  <h1 className="text-big">
                    Forums &emsp;
                  </h1>
                </div>
              </div>
            </section>
            <div className="box-main" >
              <div className="secondHalf">
                <p className="text-small">
                  Talk among others that have the same car as you.
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
        <Container>
          <div className="index_body">
            <section className="section0" >
              <div className="box-main" >
                <div className="firstHalf">
                  <h1 className="text-big">
                    Forums &emsp;
                  </h1>
                  <p className="text-small">
                    Talk among others that have the same car as you.
                  </p>
                  <div>
                    <input type="text" name="search" id="search" placeholder="Search the forums..." value={search} onChange={(event) => setSearch(event.target.value)} />
                    <Button className="btn btn-sm" type="submit" style={{ margin: "20px" }} onClick={handleSearch}>{'Search'}</Button>
                  </div>
                </div>
              </div>
              <hr />
            </section>
            <section className="section1">
              <div className="box-main">
                {showForm ? (
                  <div className="post-form">
                    <Form onSubmit={handleSubmit}>
                      <h3>Create a new post</h3>
                      <div className="form-group">
                        <Form.Label htmlFor="title">Title</Form.Label>
                        <input type="text" className="form-control" id="title" name="title" placeholder="Enter title" value={title} onChange={handleTitleChange} />
                      </div>
                      <div className="form-group">
                        <Form.Label htmlFor="content">Content</Form.Label>
                        <textarea className="form-control" id="content" name="content" rows="4" cols="75" placeholder="Enter content..." value={content} onChange={handleContentChange}></textarea>
                      </div>
                      <div className='btn-group'>
                        <Button className="btn btn-sm" style={{ margin: "20px" }} variant="primary" type="submit" >{'Submit'}</Button>
                      </div>
                      <div className="btn-group">
                        <Button className="btn btn-sm" style={{ backgroundColor: "red", borderColor: "red" }} onClick={() => setShowForm(false)}>Cancel</Button>
                      </div>
                    </Form>

                  </div>
                ) : (
                  <Button className="btn btn-sm" style={{ margin: "20px", width: "200px" }} onClick={() => setShowForm(true)}>Create a new post</Button>
                )}
              </div>
            </section>
            {posts.length > 0 ? (
              <table className="post-table">
                <thead>
                  <tr>
                    <th>Posts</th>
                    <th>Replies</th>
                    <th>Posted by</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <PostPreview key={post._id} post={post} />
                    ))
                  ) : (
                    posts.map((post) => (
                      <PostPreview key={post._id} post={post} />
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <p>There are no discussions yet. Create a post and get the conversation going!</p>
            )}
          </div>
        </Container>
      );
    }
  }
  return (
    checkSignIn({ user })
  );
};
export default Forums;
