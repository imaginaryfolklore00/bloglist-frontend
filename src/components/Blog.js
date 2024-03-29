import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, like, delete_blog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="blog" style={blogStyle}>
      <div className="defaultView" style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button id="view-button" onClick={toggleVisibility}>
          view
        </button>
      </div>
      <div className="expandedView" style={showWhenVisible}>
        {blog.title} {blog.author}
        <button id="hide-button" onClick={toggleVisibility}>
          hide
        </button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes}
        <button id="like-button" onClick={() => like(blog)}>
          like
        </button>
        <br />
        {blog.user.name}
        <br />
        <button id="delete-button" onClick={() => delete_blog(blog)}>
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  delete_blog: PropTypes.func.isRequired
};

export default Blog;
