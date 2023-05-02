import { MdMail, MdMailOutline, MdOutlineMailOutline } from "react-icons/md";
import { Link } from "react-router-dom";

const PostPreview = ({ post }) => {
  const postDate = new Date(post.createdAt);
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - postDate.getTime());
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 3600));

  let timeAgo;
  if (daysDiff > 0) {
    timeAgo = daysDiff === 1 ? "1 day ago" : `${daysDiff} days ago`;
  } else {
    timeAgo = hoursDiff === 1 ? "1 hour ago" : `${hoursDiff} hours ago`;
  }

  const data = localStorage.getItem('userData')
  const parsedData = JSON.parse(data);
  const sameCheck = () => {
    if (parsedData.username === post.author) {
      return (
        <tr>
          <td className="post-title">
            <Link to={`${process.env.PUBLIC_URL}/api/posts/${post._id}`}>{post.title}</Link>
          </td>
          <td style={{ textAlign: 'center' }} className="post-replies">
            {post.comments.length > 0 ? (
              <>
                {post.comments.length}<br /><MdMail />
              </>
            ) : (
              <>
                {post.comments.length}<br /><MdMailOutline />
              </>
            )}
          </td>
          <td style={{ textAlign: 'left' }} className="post-authors">
            <p><span className="author">{post.author}</span><br />
            <span className="timeAgo">{timeAgo}</span></p>
          </td>
        </tr>
      )
    }
    else {
      return (
        <tr>
          <td className="post-title">
            <Link to={`${process.env.PUBLIC_URL}/api/posts/${post._id}`}>{post.title}</Link>
          </td>
          <td style={{ textAlign: 'center' }} className="post-replies">
            {post.comments.length}
          </td>
          <td style={{ textAlign: 'left' }} className="post-authors">
            <p><span className="author">{post.author}</span><br/>
            <span className="timeAgo">{timeAgo}</span></p>
          </td>
        </tr>
      )
    }
  }


  return (
    sameCheck()
  );
};

export default PostPreview;
