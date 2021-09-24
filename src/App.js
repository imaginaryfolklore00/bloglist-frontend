import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setNotificationMessage(`login succesfull!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)   
    }
  }

  const logout = () => {
    try {
      setUser(null)
      blogService.setToken('')
      window.localStorage.removeItem('loggedBloglistUser')
    } catch (error) {
      console.log('error logging out')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    const addedBlog = await blogService.getById(returnedBlog.id)
    setBlogs(blogs.concat(addedBlog))
    setNotificationMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
    setTimeout(() => {
    setNotificationMessage(null)
    }, 5000)
  }

  const like = async blog => {
    try {
      const likedBlog = {...blog, likes: blog.likes + 1}
      setBlogs(blogs.map(blogPost => blogPost.id !== blog.id ? blogPost : likedBlog))
      const blogToSend = {...likedBlog, user: blog.user.id}
      await blogService.update(blog.id, blogToSend)
    } catch (error) {
      setErrorMessage('an error occured when trying to like the blog post')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const delete_blog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.delete_db(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotificationMessage(`${blog.title} by ${blog.author} deleted`)
        setTimeout(() => {
        setNotificationMessage(null)
        }, 5000)
      } catch (error) {
        setErrorMessage('an error occured when trying to delete the blog post')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  if(user === null) {
    return (
      <div>
        <Notification message={notificationMessage} />
        <Error message={errorMessage} />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <h2>blogs</h2>
          <div>
            <p>
              {user.name} logged-in
              <button onClick={() => logout()}>
                logout
              </button>
            </p>
          </div>
          <div>
            {blogForm()}
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} like={like} delete_blog={delete_blog} />
            )}
          </div>
    </div>
  )
}

export default App