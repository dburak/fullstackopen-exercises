import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();
  const vote = (id) => {
    let obj = anecdotes.find((anecdote) => anecdote.id === id);
    dispatch(voteOf(obj));
  };

  const voteOf = (obj) => {
    return {
      type: 'VOTE',
      payload: {
        obj,
      },
    };
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
