import React, { useState } from 'react'

const Blog = ({blog, like}, ref) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

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

  const addLike = () => {
    setLikes(blog.likes + 1)
  }

  const likeButton = () => {
    addLike()
    like(blog)
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
        likes {likes}
        <button onClick={() => likeButton()}>like</button>
        <br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog