import { useMutation } from '@apollo/client';
import React from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Logout';
import { useAppDispatch } from '../../context/hooks';
import { logout } from '../../context/slices/AuthSlice';

const HomePage = () => {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div
        onClick={handleLogout}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        <span className=" font-semibold text-sm">Log out</span>
      </div>
    </div>
  );
};

export default HomePage;
