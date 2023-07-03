import React, { useState } from 'react';

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (e) => {
    e.preventDefault();
    createBlog({
      author: author,
      title: title,
      url: url,
      likes: 0,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            data-testid="title"
            type='text'
            value={title}
            name='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            data-testid="author"
            type='text'
            value={author}
            name='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            data-testid="url"
            type='text'
            value={url}
            name='url'
            onChange={({ target }) => setUrl(target.value)}
          />
          <br />
          <button type='submit'>create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
