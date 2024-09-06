// src/navigations/AppNavigator.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import AppLayout from '../AppLayout';

const AppNavigator: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Diğer rotalarınızı ekleyin */}
      </Routes>
    </AppLayout>
  );
};

export default AppNavigator;
