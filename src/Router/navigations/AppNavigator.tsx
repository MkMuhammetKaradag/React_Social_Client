// src/navigations/AppNavigator.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import AppLayout from '../AppLayout';
import CreatePost from '../../components/CreatePost';
import ExplorePage from '../../pages/App/ExplorePage';

const AppNavigator: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create" element={<CreatePost />} />

        {/* Diğer rotalarınızı ekleyin */}
      </Routes>
    </AppLayout>
  );
};

export default AppNavigator;
