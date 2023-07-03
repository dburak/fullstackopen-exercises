import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import CreateForm from './CreateForm';

test('renders the blog\'s title and author', () => {
  const blog = {
    title: 'Title in test',
    author: 'Author in test',
  };

  const { container } = render(<Blog initialBlog={blog} />);

  const div = container.querySelector('.blog');
  expect(div).toHaveTextContent('Title in test');
  expect(div).toHaveTextContent('Author in test');
});

test('checks that the blog\'s URL and number of likes are shown when the button controlling the view  has been clicked', async () => {
  const blog = {
    title: 'Title in test',
    author: 'Author in test',
    url: 'url',
    likes: 0,
    user: [
      {
        name: 'Burak Diker',
        id: 123
      }
    ],
  };

  const { container } = render(<Blog initialBlog={blog} />);

  const div = container.querySelector('.blog');

  const user = userEvent.setup();
  const button = screen.getByText('view')
  await user.click(button);

  expect(div).toHaveTextContent('url');
  expect(div).toHaveTextContent('likes 0');


});

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    title: 'Title in test',
    author: 'Author in test',
    url: 'url',
    likes: 0,
    user: [
      {
        name: 'Burak Diker',
        id: 123
      }
    ],
  };

  const mockHandler = jest.fn();

  render(<Blog initialBlog={blog} onLike={mockHandler} />);

  const viewButton = screen.getByText('view');
  await userEvent.click(viewButton);

  const likeButton = screen.getByText('like');
  userEvent.click(likeButton);
  userEvent.click(likeButton);

  expect(mockHandler).toHaveBeenCalledTimes(2);

} )

test('test for the new blog form', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<CreateForm createBlog={createBlog} />)

  const titleInput = screen.getByTestId('title');
  const authorInput = screen.getByTestId('author');
  const urlInput = screen.getByTestId('url');
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form title')
  await user.type(authorInput, 'testing a form author')
  await user.type(urlInput, 'testing a form url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a form author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a form url')

})