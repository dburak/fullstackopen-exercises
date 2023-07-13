import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import CreateForm from './components/CreateForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import { setReduxNotification } from './reducers/notificationReducer';
import { setReduxBlogs, createReduxBlog } from './reducers/blogReducer';
import {
  setReduxLogin,
  setReduxLogout,
  setReduxAuth,
} from './reducers/loginReducer';

const App = () => {
  const blogFormRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(setReduxBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setReduxAuth(user));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await dispatch(setReduxLogin(username, password));
      setUsername('');
      setPassword('');
      dispatch(
        setReduxNotification(
          {
            message: 'Successfully logged in',
            type: 'success',
          },
          3
        )
      );
    } catch (error) {
      dispatch(
        setReduxNotification(
          {
            message: 'wrong username or password',
            type: 'error',
          },
          3
        )
      );
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    dispatch(setReduxLogout());
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      dispatch(createReduxBlog(blogObject));
      dispatch(
        setReduxNotification(
          {
            message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
            type: 'success',
          },
          5
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type='submit'>
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in{' '}
        <button id='btnLogout' onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <CreateForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
