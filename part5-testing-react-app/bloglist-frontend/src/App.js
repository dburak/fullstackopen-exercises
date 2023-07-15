import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import CreateForm from './components/CreateForm';
import Togglable from './components/Togglable';
import { useDispatch } from 'react-redux';
import { setReduxBlogs } from './reducers/blogReducer';
import { useNotify } from './NotificationContext';
import { useLogin, useAuthValue, useLogout } from './AuthContext';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const blogFormRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const notifyWith = useNotify();
  const loginWith = useLogin();
  const logout = useLogout();

  const result = useQuery('blogs', blogService.getAll, {
    retry: 1,
  });

  const user = useAuthValue();

  const blogMutation = useMutation(blogService.createBlog, {
    onSuccess: (createdBlog) => {
      queryClient.invalidateQueries('blogs');
      notifyWith({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success',
      });
    },
  });

  useEffect(() => {
    dispatch(setReduxBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      loginWith(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(loggedUser));
      blogService.setToken(loggedUser.token);
      loginWith(loggedUser);
      setUsername('');
      setPassword('');
      notifyWith({
        message: 'Successfully logged in',
        type: 'success',
      });
    } catch (error) {
      notifyWith({
        message: 'wrong username or password',
        type: 'error',
      });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    logout();
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    blogMutation.mutate(blogObject);
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

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const blogs = result.data;

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
