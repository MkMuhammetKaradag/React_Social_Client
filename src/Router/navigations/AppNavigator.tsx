// src/navigations/AppNavigator.tsx
import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import AppLayout from '../AppLayout';
import ExplorePage from '../../pages/App/ExplorePage';
import PostPage from '../../pages/App/PostPage';
import UserPage from '../../pages/App/UserPage';
import FollowersAndFollowingPage from '../../pages/App/FollowersAndFollowingPage';

import ChatWindow from '../../pages/App/ChatWindow';
import DirectPage from '../../pages/App/DirectPage';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { useSubscription } from '@apollo/client';
import { VIDEO_CALL_STARTED } from '../../graphql/subscriptions/StartVideoCall';
import { useAppSelector } from '../../context/hooks';
import VideoCallPage from '../../pages/App/VideoCallPage';
import AccountPage from '../../pages/App/AccountPage';
import ProfileEditPage from '../../pages/App/ProfileEditPage';
import FollowRequestPage from '../../pages/App/FollowRequestPage';
import FollowingRequestPage from '../../pages/App/FollowingRequestPage';
import InterestsPage from '../../pages/App/InterestsPage';
import PostsILikedGrid from '../../components/App/PostsILikedGrid';
import PostsILikedPage from '../../pages/App/PostsILikedPage';
import { useStatusUpdater } from '../../hooks/useStatusUpdater';
interface VideoCallStartedNotification {
  userName: string;
  chatId: string;
}

const IncomingCallListener = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { data } = useSubscription(VIDEO_CALL_STARTED, {
    variables: {
      userId: user?._id,
    },
  });

  const navigate = useNavigate();
  const location = useLocation(); // Mevcut konumu al
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data?.videoCallStarted) {
      const { userName, chatId } =
        data.videoCallStarted as VideoCallStartedNotification;

      const toastId = toast.info(
        <div className="p-2 ">
          <div>Incoming call from {userName}</div>
          <div>
            <button
              className="bg-green-400 p-3 hover:bg-green-500"
              onClick={() => handleAcceptCall(chatId)}
            >
              Accept
            </button>
            <button
              className="bg-red-400 p-3 hover:bg-red-500"
              onClick={() => handleRejectCall()}
            >
              Reject
            </button>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        }
      );

      timerRef.current = setTimeout(() => {
        handleRejectCall();
        toast.dismiss(toastId);
      }, 10000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data]);

  const handleAcceptCall = (chatId: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Ses çalmayı durdur

    navigate(`/call/${chatId}`, {
      state: { backgroundLocation: location }, // Mevcut konumu backgroundLocation olarak gönder
    });
    toast.dismiss();
    // Örneğin: history.push(`/chat/${chatId}`);
  };

  const handleRejectCall = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    toast.dismiss();
  };

  return null; // Bu bileşen herhangi bir UI render etmez
};

const AppNavigator: React.FC = () => {
  const location = useLocation();
  useStatusUpdater();
  // State içinde önceki sayfanın konumunu alıyoruz
  const state = location.state as { backgroundLocation?: Location };
  return (
    <AppLayout>
      <>
        <ToastContainer transition={Slide} />
        <IncomingCallListener />
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />

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
            <Route path="t/:chatId" element={<ChatWindow />} />
          </Route>
          <Route path="/accounts" element={<AccountPage />}>
            <Route
              index
              element={
                <div className="w-2/3 flex items-center justify-center text-2xl text-gray-500">
                  AyarSeçiniz
                </div>
              }
            />
            <Route path="edit" element={<ProfileEditPage></ProfileEditPage>} />
            <Route
              path="followRequest"
              element={<FollowRequestPage></FollowRequestPage>}
            />
            <Route
              path="followingRequest"
              element={<FollowingRequestPage></FollowingRequestPage>}
            />
            <Route path="interests" element={<InterestsPage></InterestsPage>} />
            <Route path="liked" element={<PostsILikedPage></PostsILikedPage>} />
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
            <Route
              path="/call/:chatId"
              element={<VideoCallPage></VideoCallPage>}
            />
          </Routes>
        )}
      </>
    </AppLayout>
  );
};

export default AppNavigator;
