import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { NotificationContextProvider } from './NotificationContext';
import { AuthContextProvider } from './AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </Provider>
);
