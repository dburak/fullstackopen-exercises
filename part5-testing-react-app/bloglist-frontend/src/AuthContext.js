import { createContext, useReducer, useContext } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
  case 'SET_LOGIN':
    return action.payload;
  case 'SET_LOGOUT':
    return null;
  default:
    return state;
  }
};

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [user, dispatch] = useReducer(reducer, null);

  return (
    <AuthContext.Provider value={[user, dispatch]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthValue = () => {
  const [user] = useContext(AuthContext);
  return user;
};

export const useLogin = () => {
  const valueAndDispatch = useContext(AuthContext);
  const dispatch = valueAndDispatch[1];
  return (payload) => {
    dispatch({ type: 'SET_LOGIN', payload });
  };
};

export const useLogout = () => {
  const valueAndDispatch = useContext(AuthContext);
  const dispatch = valueAndDispatch[1];
  return () => {
    dispatch({ type: 'SET_LOGOUT' });
  };
};

export default AuthContext;
