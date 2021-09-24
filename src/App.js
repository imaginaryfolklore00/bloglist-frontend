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

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
    .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
        setNotificationMessage(null)
        }, 5000)
    })
  }

  const like = async blog => {
    try {
      const likedBlog = {...blog, user: blog.user.id, likes: blog.likes + 1}
      await blogService.update(blog.id, likedBlog)
      const updatedBlog = await blogService.getById(blog.id)
      setBlogs(blogs.map(blogPost => blogPost.id !== blog.id ? blogPost : updatedBlog))
    } catch (error) {
      setErrorMessage('an error occured when trying to like the blog post')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)   
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
              <Blog key={blog.id} blog={blog} like={like} />
            )}
          </div>
    </div>
  )
}

export default App