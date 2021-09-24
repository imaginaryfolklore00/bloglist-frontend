import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, like, delete_blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes}
        <button onClick={() => like(blog)}>like</button>
        <br />
        {blog.user.name}
        <br/>
        <button onClick={() => delete_blog(blog)}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  delete_blog: PropTypes.func.isRequired
}

export default Blog