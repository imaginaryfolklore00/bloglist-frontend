import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders only title and author by default', () => {
  const blog = {
    title: 'some blog',
    author: 'some author',
    url: 'someurl.com',
    likes: 4,
    user: '61387c582681f50d346613e0'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} like={mockHandler} delete_blog={mockHandler}/>
  )

  const defaultView = component.container.querySelector('.defaultView')

  expect(defaultView).toHaveTextContent(
    'some blog'
  )

  expect(defaultView).toHaveTextContent(
    'some author'
  )

  expect(defaultView).not.toHaveTextContent(
    'someurl.com'
  )

  expect(defaultView).not.toHaveTextContent(
    '4'
  )
})

test('url and likes are shown when expanded', () => {
  const blog = {
    title: 'some blog',
    author: 'some author',
    url: 'someurl.com',
    likes: 4,
    user: '61387c582681f50d346613e0'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} like={mockHandler} delete_blog={mockHandler}/>
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const div = component.container.querySelector('.expandedView')
  expect(div).not.toHaveStyle('display: none')

  expect(div).toHaveTextContent(
    'some blog'
  )

  expect(div).toHaveTextContent(
    'some author'
  )

  expect(div).toHaveTextContent(
    'someurl.com'
  )

  expect(div).toHaveTextContent(
    '4'
  )
})

test('like button is called correctly', () => {
  const blog = {
    title: 'some blog',
    author: 'some author',
    url: 'someurl.com',
    likes: 4,
    user: '61387c582681f50d346613e0'
  }

  const mockHandler = jest.fn()
  const like = jest.fn()

  const component = render(
    <Blog blog={blog} like={like} delete_blog={mockHandler}/>
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(like.mock.calls).toHaveLength(2)
})