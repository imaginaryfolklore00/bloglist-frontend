import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Error from './components/Error';
import blogService from './services/blogs';
import loginService from './services/login';
import './index.css';
import { setNotification } from './reducers/notificationReducer';
import { setError } from './reducers/errorReducer';

const App = () => {
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password
      });
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      dispatch(setNotification('login succesfull!', 5));
      setUsername('');
      setPassword('');
    } catch (error) {
      dispatch(setError('wrong username or password', 5));
    }
  };

  const logout = () => {
    try {
      setUser(null);
      blogService.setToken('');
      window.localStorage.removeItem('loggedBloglistUser');
    } catch (error) {
      console.log('error logging out');
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );

  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const returnedBlog = await blogService.create(blogObject);
    const addedBlog = await blogService.getById(returnedBlog.id);
    setBlogs(blogs.concat(addedBlog));
    dispatch(
      setNotification(
        `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
        5
      )
    );
  };

  const like = async (blog) => {
    try {
      const likedBlog = { ...blog, likes: blog.likes + 1 };
      setBlogs(
        blogs.map((blogPost) =>
          blogPost.id !== blog.id ? blogPost : likedBlog
        )
      );
      const blogToSend = { ...likedBlog, user: blog.user.id };
      await blogService.update(blog.id, blogToSend);
    } catch (error) {
      dispatch(
        setError('an error occured when trying to like the blog post', 5)
      );
    }
  };

  const delete_blog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.delete_db(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        dispatch(setNotification(`${blog.title} by ${blog.author} deleted`, 5));
      } catch (error) {
        dispatch(
          setError('an error occured when trying to delete the blog post', 5)
        );
      }
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification />
        <Error />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    );
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification />
      <Error />
      <h2>blogs</h2>
      <div>
        <p>
          {user.name} logged-in
          <button id="logout-button" onClick={() => logout()}>
            logout
          </button>
        </p>
      </div>
      <div>
        {blogForm()}
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={like}
            delete_blog={delete_blog}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
