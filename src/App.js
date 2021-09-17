import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
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
      window.localStorage.removeItem('loggedBloglistUser')
    } catch (error) {
      console.log('error logging out')
    }
  }

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
        })
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
        type="text"
        value={newTitle}
        name="Title"
        onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
        type="text"
        value={newAuthor}
        name="Author"
        onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
        type="text"
        value={newUrl}
        name="Url"
        onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

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
            <h2>create new</h2>
          </div>
          <div>
            {blogForm()}
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
    </div>
  )
}

export default App