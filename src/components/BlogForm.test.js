import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

test('a new blog is created correctly', () => {
  const createBlog = jest.fn();

  const component = render(<BlogForm createBlog={createBlog} />);

  const title = component.container.querySelector('#title');
  const author = component.container.querySelector('#author');
  const url = component.container.querySelector('#url');
  const form = component.container.querySelector('form');

  fireEvent.change(title, {
    target: { value: 'some blog' }
  });

  fireEvent.change(author, {
    target: { value: 'some author' }
  });

  fireEvent.change(url, {
    target: { value: 'someurl.com' }
  });

  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('some blog');
  expect(createBlog.mock.calls[0][0].author).toBe('some author');
  expect(createBlog.mock.calls[0][0].url).toBe('someurl.com');
});
