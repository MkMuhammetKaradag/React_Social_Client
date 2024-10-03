import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries/GetMe';

export const useSessionValidator = (interval = 5 * 60 * 1000) => {
  const [isSessionValid, setIsSessionValid] = useState(true);
  const { refetch } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setIsSessionValid(!!data.getMe);
    },
    onError: () => {
      setIsSessionValid(false);
    },
  });
  useEffect(() => {
    const validateSession = async () => {
      try {
        const { data } = await refetch();
        setIsSessionValid(!!data.me);
      } catch (error) {
        console.error('Session validation error:', error);
        setIsSessionValid(false);
      }
    };

    const intervalId = setInterval(validateSession, interval);

    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  return isSessionValid;
};
