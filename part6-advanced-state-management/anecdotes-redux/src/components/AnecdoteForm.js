import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const [newAnecdote, setNewAnecdote] = useState('');

  const create = async (e) => {
    e.preventDefault();
    dispatch(createAnecdote(newAnecdote));
    setNewAnecdote('');
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>
          <input
            type='text'
            value={newAnecdote}
            onChange={(event) => setNewAnecdote(event.target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
