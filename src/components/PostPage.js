import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs"
import { MdArrowBack } from 'react-icons/md'
import { UserContext } from './userContext';
import { Row, Col, Button, NavLink } from 'react-bootstrap';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [empty, setEmpty] = useState(false);
  const [content, setContent] = useState('');
  const [postDate, setPostDate] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch the post data
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        const postData = await response.json();
        setPost(postData);
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
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    const data = localStorage.getItem('userData')
    const parsedData = JSON.parse(data);
    event.preventDefault();
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        content: content,
        author: `${parsedData.username}`
      })
    });
    if (response.ok) {
      const data = await response.json();
      const newComment = Array.isArray(comments) ? [...comments, data] : [data];
      setComments([...newComment]);
    }
  }

  return (
    <div>
      <section>
        <div>
          <h3>
            <NavLink eventkey="3" style={{ display: "inline-block" }} as={Link} to={`${process.env.PUBLIC_URL}/forums`} href={`${process.env.PUBLIC_URL}/forums`}><MdArrowBack /></NavLink>
            &emsp;&emsp;{post.title}{user && user.username === post.author && (
              <>
                <button className="btn dropdown-toggle-no-arrow p-0 border-0 bg-transparent" style={{ margin: "auto" }} type="button" id="postDropdownMenu" data-bs-toggle="dropdown">&emsp;<BsThreeDotsVertical /></button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="postDropdownMenu" style={{ width: "auto", height: "auto" }}>
                  <li><Button className="dropdown-item" onClick={() => console.log("Edit post")} style={{ width: "auto", height: "auto" }}>{"Edit"}</Button></li>
                  <li><Button className="dropdown-item" onClick={() => console.log("Delete post")} style={{ width: "auto", height: "auto" }}>{"Delete"}</Button></li>
                </ul>
              </>
            )}
          </h3>
          <Row>
            <Col>
              <p>
                posted by: <b>{post.author}</b>
                <div style={{fontSize: "small"}}>{postDate.toLocaleString()}</div>
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
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-content">
                    <Row>
                      <Col>
                        <p className="comment-author">{comment.author} <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span></p>
                        <p className="comment-text">{comment.content}</p>
                      </Col>
                      <Col>
                        {user && user.username === comment.author && (
                          <>
                            <button className="btn dropdown-toggle-no-arrow p-0 border-0 bg-transparent" style={{ margin: "auto" }} type="button" id="postDropdownMenu" data-bs-toggle="dropdown">&emsp;<BsThreeDotsVertical /></button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="postDropdownMenu" style={{ width: "auto", height: "auto" }}>
                              <li><Button className="dropdown-item" onClick={() => console.log("Edit comment")} style={{ width: "auto", height: "auto" }}>{"Edit"}</Button></li>
                              <li><Button className="dropdown-item" onClick={() => console.log("Delete comment")} style={{ width: "auto", height: "auto" }}>{"Delete"}</Button></li>
                            </ul>
                          </>
                        )}
                      </Col>
                    </Row>

                  </div>
                </div>
              ))}
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
                <textarea className="form-control" id="content" name="content" rows="4" cols="50" placeholder="Add a comment..." value={content} onChange={handleContentChange}></textarea>
              </div>
              <Button type="submit" style={{margin: "20px", height:"auto", width:"auto"}}className="btn btn-primary">{"Submit"}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostPage;