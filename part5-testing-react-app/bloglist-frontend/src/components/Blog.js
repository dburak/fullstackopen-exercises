import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ initialBlog, onLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  };

  const [blog, setBlog] = useState(initialBlog);
  const [detailedView, setDetailedView] = useState(false);


  if (typeof onLike === 'function') {
    onLike();
  }

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
      <div style={blogStyle} className='blog'>
        <p>
          {blog.title} {blog.author} <button id='btnHide' onClick={handleView}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button id='btnLike' onClick={handleLike}>like</button>
        </p>
        <p>{blog.user[0].name}</p>
        {blog.user[0].id === loggedUser.id && (
          <button id='btnRemove' onClick={handleDelete}>remove</button>
        )}
      </div>
    );
  } else {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author} <button id='btnView' className='view' onClick={handleView}>view</button>
      </div>
    );
  }
};

export default Blog;
