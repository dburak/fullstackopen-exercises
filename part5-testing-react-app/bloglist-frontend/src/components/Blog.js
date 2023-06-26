import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ initialBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  };
  const [detailedView, setDetailedView] = useState(false);
  const [blog, setBlog] = useState(initialBlog);

  const handleView = () => {
    setDetailedView(!detailedView);
  };

  const handleLike = async () => {
    const updatedObj = {
      ...blog,
      likes: ++blog.likes,
      user: blog.user[0].id,
    };

    const response = await blogService.updateLike(updatedObj);

    setBlog(response);
  };

  const handleDelete = async () => {
    const res = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);

    if (res) {
      await blogService.deleteblog(blog);
      setBlog(null);
    }
  };

  const loggedUser = JSON.parse(localStorage.getItem('loggedBlogUser'));

  if (!blog) {
    return null;
  }

  if (detailedView) {
    return (
      <div style={blogStyle}>
        <p>
          {blog.title} {blog.author} <button onClick={handleView}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{blog.user[0].name}</p>
        {blog.user[0].id === loggedUser.id && (
          <button onClick={handleDelete}>remove</button>
        )}
      </div>
    );
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={handleView}>view</button>
      </div>
    );
  }
};

export default Blog;
