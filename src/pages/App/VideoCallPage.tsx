import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { JOIN_VIDEO_ROOM_TOKEN } from '../../graphql/mutations/JoinVideoRoom';
import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useParticipantTracks,
} from '@livekit/components-react';
import { Track, Participant } from 'livekit-client';
import '@livekit/components-styles';
import VideoAudioLayout from '../../components/App/VideoAudioLayout';
import { AiOutlineClose } from 'react-icons/ai';
import { START_VIDEO_CALL } from '../../graphql/mutations/VideoCallStart';

const serverUrl = 'wss://dcclone-gh7o1vv0.livekit.cloud';

const VideoCallPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [joinVideoRoom, { data }] = useMutation(JOIN_VIDEO_ROOM_TOKEN);

  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (chatId) {
      joinVideoRoom({
        variables: { chatId },
      });

     
    }
  }, [chatId, joinVideoRoom]);

  const handleDisconnect = () => {
    setIsConnected(false);
    // Burada kullanıcıyı chat sayfasına yönlendirebilirsiniz
  };

  if (!data?.joinVideoRoom) {
    return <div>Loading...</div>;
  }
  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname || '/', { replace: true });
    } else {
      navigate('/');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="absolute   top-0 right-0 justify-end p-4">
        <button onClick={handleClose} className="text-white  text-3xl">
          <AiOutlineClose />
        </button>
      </div>
      <div className="bg-white w-full max-w-6xl  h-full  md:max-h-[95vh]  ">
        <LiveKitRoom
          video={true}
          audio={true}
          token={data.joinVideoRoom}
          serverUrl={serverUrl}
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

function Stage() {
  const participants = useParticipants();
  return (
    <div>
      <h2>Katılımcılar</h2>
      <div className="grid grid-cols-2 gap-2">
        {participants.map((participant) => (
          <div key={participant.sid}>
            <CusParticipant participant={participant} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CusParticipant({ participant }: { participant: Participant }) {
  const participatTracks = useParticipantTracks(
    [Track.Source.ScreenShare, Track.Source.Camera, Track.Source.Microphone],
    participant.identity
  );
  return (
    <div className="z-0 col-span-1">
      <VideoAudioLayout participantTracks={participatTracks} />
    </div>
  );
}

export default VideoCallPage;
