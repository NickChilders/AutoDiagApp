import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from './userContext';
import { Row, Col } from 'react-bootstrap';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [empty, setEmpty] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch the post data
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        const postData = await response.json();
        setPost(postData);

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
        <Row>
          <Col>
            <h3>{post.title}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>posted by: {post.author}</p>
          </Col>
        </Row>
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
                    <p className="comment-author">{comment.author} <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span></p>
                    <p className="comment-text">{comment.content}</p>
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
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostPage;