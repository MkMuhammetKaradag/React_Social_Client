// src/navigations/AppNavigator.tsx
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage, { Post } from '../../pages/App/HomePage';
import AppLayout from '../AppLayout';
import CreatePost from '../../components/CreatePost';
import ExplorePage from '../../pages/App/ExplorePage';
import PostPage from '../../pages/App/PostPage';

const AppNavigator: React.FC = () => {
  const location = useLocation();

  // State içinde önceki sayfanın konumunu alıyoruz
  const state = location.state as { backgroundLocation?: Location };
  return (
    <AppLayout>
      <>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create" element={<CreatePost />} />
          {/* <Route path="/p/:postId" element={<PostModal></PostModal>} /> */}
        </Routes>
        {/* Eğer modal açılacaksa bu blok devreye girer */}
        {state?.backgroundLocation && (
          <Routes>
            <Route path="/p/:postId" element={<PostPage />} />
          </Routes>
        )}
      </>
    </AppLayout>
  );
};

export default AppNavigator;
