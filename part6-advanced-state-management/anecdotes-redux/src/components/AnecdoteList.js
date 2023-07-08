import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
    dispatch({ type: 'anecdotes/vote', payload: obj });
    dispatch({ type: 'notification/setNotification', payload: obj });
    setTimeout(() => {
      dispatch({ type: 'notification/reset' });
    }, 5000);
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
