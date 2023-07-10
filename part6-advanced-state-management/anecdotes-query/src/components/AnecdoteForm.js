import { useMutation, useQueryClient } from 'react-query';
import { createAnecdote } from '../requests';
import { useNotificationDispatch } from '../NotificationContext';

const AnecdoteForm = () => {
  const generatedId = Number((Math.random() * 1000000).toFixed(0));
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  let content;

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes');
      dispatch({ type: 'CREATE', payload: content });
      setTimeout(() => {
        dispatch({ type: 'CREATE', payload: null });
      }, 5000);
    },
    onError: () => {
      dispatch({
        type: 'CREATE',
        payload: 'too short anecdote, must have length 5 or more',
      });
      setTimeout(() => {
        dispatch({ type: 'CREATE', payload: null });
      }, 5000);
    },
  });
  const onCreate = (event) => {
    event.preventDefault();
    content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({
      content,
      id: generatedId,
      votes: 0,
    });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
