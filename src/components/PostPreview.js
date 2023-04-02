import React from "react";
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

  return (
    <tr>
      <td className="post-title">
        <Link to={`${process.env.PUBLIC_URL}/api/posts/${post._id}`}>{post.title}</Link>
      </td>
      <td className="post-replies">
        {post.comments.length}
      </td>
      <td className="post-authors">
        &emsp;<span className="author">{post.author}</span> <span className="timeAgo">&emsp;&emsp;{timeAgo}</span>
      </td>
    </tr>
  );
};

export default PostPreview;
