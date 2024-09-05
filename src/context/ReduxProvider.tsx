import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useQuery } from '@apollo/client';
import AuthReducer from './slices/AuthSlice';
import AppReducer from './slices/AppSlice';
import { GET_ME } from '../graphql/queries/GetMe';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  const { data, loading, error } = useQuery(GET_ME);

  const store = useMemo(() => {
    const reducer = {
      auth: AuthReducer,
      app: AppReducer,
    };

    return configureStore({
      reducer: reducer,
      preloadedState: {
        auth: {
          user: data?.getMe || null,
          isAuthenticated: !!data?.getMe,
          isLoading: loading,
        },
        app: {
          searchText: '',
        },
      },
    });
  }, [data, loading, error]);

  if (loading) {
    return <div>Loading...</div>; // Veya bir yükleme spinner'ı
  }

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;