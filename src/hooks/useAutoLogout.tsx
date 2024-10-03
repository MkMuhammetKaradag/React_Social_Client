import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../context/hooks';
import { logout } from '../context/slices/AuthSlice';
import { useMutation } from '@apollo/client';
import { LOGOUT_USER } from '../graphql/mutations';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 dakika

export const useAutoLogout = () => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  const resetTimer = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    const [logoutUser] = useMutation(LOGOUT_USER);
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
      try {
        await logoutUser();
        dispatch(logout());
      } catch (err) {
        console.error('Logout error:', err);
      }
    };
    const intervalId = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        handleLogout();
      }
    }, 60000);
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
      clearInterval(intervalId);
    };
  }, [lastActivity, navigate]);

  return resetTimer;
};
