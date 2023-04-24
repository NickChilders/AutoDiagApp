import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BsThreeDotsVertical, BsTrash, BsPencilSquare } from "react-icons/bs"
import { MdArrowBack, MdArrowRight } from 'react-icons/md'
import { UserContext } from './userContext';
import { Row, Col, Button, NavLink, Form, Modal } from 'react-bootstrap';
import NavigationBar from "./NavigationBar";

const PostPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [empty, setEmpty] = useState(false);
  const [content, setContent] = useState('');
  const [commentContent, setCommentContent] = useState('')
  const [newContent, setNewContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentId, setCommentId] = useState(null);
  const [postDate, setPostDate] = useState(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [contentChanged, setContentChanged] = useState(false);
  const history = useNavigate();
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
    const fetchPostAndComments = async () => {
      try {
        // Fetch the post data
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        const postData = await response.json();
        setPost(postData);
        setNewContent(postData.content)
        const dt = new Date(postData.createdAt)
        setPostDate(dt)
        // Fetch the comments for the post
        const commentsData = postData.comments;
        setComments(commentsData);
        if (commentsData.length === 0) {
          setEmpty(true);
          setMessage('Nobody has commented on this post yet.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPostAndComments();
  }, [id, contentChanged]);
  if (!post) {
    return <div>Loading...</div>;
  }

  const handleEdit = async (id, newContent) => {
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title: post.title,
        content: newContent,
        comments: post.comments
      })
    })
    if (response.ok) {
      setContent(newContent);
    }
    setContentChanged(true)
  }

  const handleDelete = async (id) => {
    const data = localStorage.getItem('userData')
    const parsedData = JSON.parse(data);
    await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'user': `${parsedData.username}`
      }
    });
    alert('Your post has been deleted.');
    history(`${process.env.PUBLIC_URL}/forums`);
  }

  const handleEditSubmit = (event) => {
    event.preventDefault();
    setContentChanged(false)
    handleEdit(id, newContent);
    setShowEditPostModal(false);
  };

  const handleDeleteConfirm = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      handleDelete(id);
    }
  };

  const deleteComment = async (commentId) => {
    const response = await fetch(`http://localhost:3001/api/posts/${id}/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      setContentChanged(true)
    }
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
    setContentChanged(false);
  }

  const handleEditComment = (comment) => {
    setNewCommentContent(comment.content);
    setCommentId(comment._id);
    setShowEditCommentModal(true);
    setContentChanged(false);
  }

  const editCommentFunction = async () => {
    const response = await fetch(`http://localhost:3001/api/posts/${id}/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        content: newCommentContent
      })
    });
    if (response.ok) {
      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            content: newCommentContent
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setContentChanged(true);
      setCommentContent('');
    }
  };

  const handleEditCommentSubmit = (event) => {
    event.preventDefault();
    editCommentFunction()
    setShowEditCommentModal(false);
    setContentChanged(false)
  };

  const handleCommentAdd = (event) => {
    event.preventDefault();
    setCommentContent(event.target.value);
    setContentChanged(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = localStorage.getItem('userData')
    const parsedData = JSON.parse(data);
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        content: commentContent,
        author: `${parsedData.username}`
      })
    });
    if (response.ok) {
      const data = await response.json();
      const newComment = Array.isArray(comments) ? [...comments, data] : [data];
      setComments([...newComment]);
      setCommentContent('');
      setContentChanged(true)
    }
  }

  return (
    <div>
      <div>
      <NavigationBar make={make} model={model} year={year} />
        <NavLink eventkey="3" style={{ display: "inline-block" }} as={Link} to={`${process.env.PUBLIC_URL}/forums`} href={`${process.env.PUBLIC_URL}/forums`}><u style={{color: "blue"}}>Forums</u></NavLink><MdArrowRight /><b>{post.title}</b>
      </div>
      <hr />
      <section>
        <div>
          <div className="box-main">
            <h3>
              <u>
                {post.title}{user && user.username === post.author && (
                  <>
                    <button className="btn dropdown-toggle-no-arrow p-0 border-0 bg-transparent" style={{ margin: "auto" }} type="button" id="postDropdownMenu" data-bs-toggle="dropdown">&emsp;<BsThreeDotsVertical /></button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="postDropdownMenu" style={{ width: "auto", height: "auto" }}>
                      <Button className="dropdown-item" onClick={() => setShowEditPostModal(true)} style={{ width: "auto", height: "auto" }}>{"Edit"} <BsPencilSquare /></Button>
                      <Button className="dropdown-item" onClick={handleDeleteConfirm} style={{ width: "auto", height: "auto" }}>{"Delete"} <BsTrash /></Button>
                    </div>
                    <Modal show={showEditPostModal} onHide={() => setShowEditPostModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Post</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                          <Form.Group controlId="postContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newContent} onChange={(e) => setNewContent(e.target.value)} required />
                          </Form.Group>
                          <Button variant="primary" type="submit">
                            Save Changes
                          </Button>
                        </Form>
                      </Modal.Body>
                    </Modal>
                  </>
                )}
              </u>
            </h3>
          </div>
          <Row>
            <Col>
              <p>
                posted by: <b>{post.author}</b>
                &emsp;<span style={{ fontSize: "small" }}>{postDate.toLocaleString()}</span>
              </p>
            </Col>
          </Row>
        </div>
      </section>
      <hr />
      <section>
        <div className="box-main">
          <p>{post.content}</p>
        </div>
      </section>
      <hr />
      <section>
        <h5>Comments</h5>
        <div className="comments-box">
          {empty ?
            <div className="comment">{message}</div>
            :
            <>
              <hr />
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-content">
                    <Row>
                      <Col>
                        <p className="comment-author" style={{ borderRight: "double", borderBottom: "double", marginBottom: 20 }} >{comment.author} <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span></p>
                      </Col>
                      <Col>
                        <p className="comment-text">{comment.content}</p>
                      </Col>
                      <Col>
                        {user && user.username === comment.author && (
                          <>
                            <button className="btn dropdown-toggle-no-arrow p-0 border-0 bg-transparent" style={{ margin: "auto" }} type="button" id="postDropdownMenu" data-bs-toggle="dropdown">&emsp;<BsThreeDotsVertical /></button>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="postDropdownMenu" style={{ width: "auto", height: "auto" }}>
                              <Button className="dropdown-item" onClick={() => { handleEditComment(comment) }} style={{ width: "auto", height: "auto" }}>{"Edit"} <BsPencilSquare /></Button>
                              <Button className="dropdown-item" onClick={() => { handleDeleteComment(comment._id) }} style={{ width: "auto", height: "auto" }}>{"Delete"} <BsTrash /></Button>
                            </div>
                            <Modal show={showEditCommentModal} onHide={() => setShowEditCommentModal(false)}>
                              <Modal.Header closeButton>
                                <Modal.Title>Edit Comment</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form onSubmit={handleEditCommentSubmit}>
                                  <Form.Group controlId="editCommentContent">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                      as="textarea"
                                      rows={3}
                                      value={newCommentContent}
                                      onChange={(e) => setNewCommentContent(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                  <Button variant="primary" type="submit" style={{ width: "auto", height: "auto", margin: "20px" }}>
                                    {"Save Changes"}
                                  </Button>
                                </Form>
                              </Modal.Body>
                            </Modal>
                          </>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              ))}
              <hr />
            </>
          }
        </div>
      </section>
      <hr />
      <section>
        <div className="box-main">
          <div className="post-comment">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea className="form-control" id="content" name="content" rows="4" cols="50" placeholder="Add a comment..." value={commentContent} onChange={handleCommentAdd}></textarea>
              </div>
              <Button type="submit" style={{ margin: "20px", height: "auto", width: "auto" }} className="btn btn-primary">{"Submit"}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
export default PostPage;