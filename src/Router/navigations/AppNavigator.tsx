import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppNavigator;
