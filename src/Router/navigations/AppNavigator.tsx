// src/navigations/AppNavigator.tsx
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage, { Post } from '../../pages/App/HomePage';
import AppLayout from '../AppLayout';
import CreatePost from '../../components/CreatePost';
import ExplorePage from '../../pages/App/ExplorePage';
import PostPage from '../../pages/App/PostPage';
import UserPage from '../../pages/App/UserPage';
import FollowersAndFollowingPage from '../../pages/App/FollowersAndFollowingPage';
import ChatList from '../../components/App/ChatList';
import ChatWindow from '../../pages/App/ChatWindow';
import DirectPage from '../../pages/App/DirectPage';

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
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/direct" element={<DirectPage />}>
            <Route
              index
              element={
                <div className="w-2/3 flex items-center justify-center text-2xl text-gray-500">
                  Bir sohbet seçin
                </div>
              }
            />
            <Route path=":chatId" element={<ChatWindow />} />
          </Route>
        </Routes>
        {/* Eğer modal açılacaksa bu blok devreye girer */}
        {state?.backgroundLocation && (
          <Routes>
            <Route path="/p/:postId" element={<PostPage />} />
            <Route
              path="/user/:userId/:segment"
              element={<FollowersAndFollowingPage />}
            />
          </Routes>
        )}
      </>
    </AppLayout>
  );
};

export default AppNavigator;
