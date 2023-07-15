import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import blogService from '../services/blogs';

const Blog = ({ blog, onLike }) => {
  const queryClient = useQueryClient();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  };

  const [detailedView, setDetailedView] = useState(false);

  if (typeof onLike === 'function') {
    onLike();
  }

  const handleView = () => {
    setDetailedView(!detailedView);
  };

  const likeMutation = useMutation(blogService.updateLike, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const deleteMutation = useMutation(blogService.deleteblog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const handleLike = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    likeMutation.mutate(likedBlog);
  };

  const handleDelete = async () => {
    const res = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);

    if (res) {
      deleteMutation.mutate(blog);
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
          {blog.title} {blog.author}{' '}
          <button id='btnHide' onClick={handleView}>
            hide
          </button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}{' '}
          <button id='btnLike' onClick={() => handleLike(blog)}>
            like
          </button>
        </p>
        <p>{blog.user[0].name}</p>
        {blog.user[0].id === loggedUser.id && (
          <button id='btnRemove' onClick={() => handleDelete(blog)}>
            remove
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}{' '}
        <button id='btnView' className='view' onClick={handleView}>
          view
        </button>
      </div>
    );
  }
};

export default Blog;
