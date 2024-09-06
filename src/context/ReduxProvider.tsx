import React, { useMemo, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useQuery } from '@apollo/client';
import AuthReducer from './slices/AuthSlice';
import AppReducer from './slices/AppSlice';
import { GET_ME } from '../graphql/queries/GetMe';

// Yeni Loading komponenti
const Loading = () => (
  <div className="h-screen w-full bg-black text-white flex items-center justify-center">
    Loading...
  </div>
);

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  const { data, loading, error } = useQuery(GET_ME);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loading]);

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

  if (loading && showLoading  ) {
    return <Loading />;
  }

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
