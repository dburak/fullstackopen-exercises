import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const obj = action.payload;
      const updatedState = state.map((anecdote) => {
        if (anecdote.id === obj.id) {
          return { ...anecdote, votes: anecdote.votes + 1 };
        }
        return anecdote;
      });
      return updatedState;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { vote, create, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const appendVote = (obj) => {
  return async (dispatch) => {
    const votedAnecdote = await anecdoteService.updateAnecdote(obj);
    dispatch(vote(votedAnecdote));
  };
};

export default anecdoteSlice.reducer;
