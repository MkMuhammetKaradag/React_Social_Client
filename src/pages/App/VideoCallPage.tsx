// VideoCallPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { JOIN_VIDEO_ROOM_TOKEN } from '../../graphql/mutations/JoinVideoRoom';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react';
import '@livekit/components-styles';
import LoadingSpinner from '../../components/App/LoadingSpinner';
import CloseButton from '../../components/App/CloseButton';
import Stage from '../../components/App/Stage';

const SERVER_URL = 'wss://dcclone-gh7o1vv0.livekit.cloud';

const VideoCallPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [joinVideoRoom, { data }] = useMutation(JOIN_VIDEO_ROOM_TOKEN);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (chatId) {
      joinVideoRoom({ variables: { chatId } });
    }
  }, [chatId, joinVideoRoom]);

  const handleDisconnect = () => setIsConnected(false);

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };

  if (!data?.joinVideoRoom) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <CloseButton onClick={handleClose} />
      <div className="bg-white w-full max-w-6xl h-full md:max-h-[95vh]">
        <LiveKitRoom
          video={true}
          audio={true}
          token={data.joinVideoRoom}
          serverUrl={SERVER_URL}
          className="h-full bg-black text-white overflow-y-auto"
          connect={true}
          onConnected={() => setIsConnected(true)}
          onDisconnected={handleDisconnect}
        >
          {isConnected && <Stage />}
          <RoomAudioRenderer />
          <ControlBar />
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default VideoCallPage;
