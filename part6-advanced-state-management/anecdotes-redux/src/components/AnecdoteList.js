import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteOf } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => {
    if (state.filters === '') {
      return state.anecdotes;
    } else {
      return state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filters.toLowerCase())
      );
    }
  });
  const vote = (id) => {
    let obj = anecdotes.find((anecdote) => anecdote.id === id);
    dispatch(voteOf(obj));
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
