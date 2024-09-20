import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { MdVideoCall } from 'react-icons/md';
import Messages from '../../components/App/Messages';
import MessageInput from '../../components/App/MessageInput';
import { START_VIDEO_CALL } from '../../graphql/mutations/VideoCallStart';

const ChatWindow: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [initiateVideoCall] = useMutation(START_VIDEO_CALL);
  const location = useLocation();

  if (!chatId) {
    return <div className="text-center p-4">Sohbet bulunamadı</div>;
  }

  const handleVideoCallInitiation = async () => {
    try {
      await initiateVideoCall({ variables: { chatId } });
    } catch (error) {
      toast.error('Görüntülü arama başlatılamadı');
    }
  };

  return (
    <div className="flex flex-col h-[95vh]">
      <ChatHeader
        chatId={chatId}
        onVideoCallStart={handleVideoCallInitiation}
        location={location}
      />
      <Messages chatId={chatId} />
      <MessageInput chatId={chatId} />
    </div>
  );
};

interface ChatHeaderProps {
  chatId: string;
  onVideoCallStart: () => Promise<void>;
  location: ReturnType<typeof useLocation>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatId,
  onVideoCallStart,
  location,
}) => (
  <div className="bg-gray-200 p-4 flex justify-between items-center">
    <h2 className="text-xl font-bold">Sohbet</h2>
    <Link
      to={`/call/${chatId}`}
      onClick={onVideoCallStart}
      state={{ backgroundLocation: location }}
    >
      <MdVideoCall
        className="cursor-pointer text-blue-600 hover:text-blue-800"
        size={35}
      />
    </Link>
  </div>
);

export default ChatWindow;
