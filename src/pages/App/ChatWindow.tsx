import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Messages from '../../components/App/Messages';
import MessageInput from '../../components/App/MessageInput';
import { MdVideoCall } from 'react-icons/md';
import { useMutation } from '@apollo/client';
import { START_VIDEO_CALL } from '../../graphql/mutations/VideoCallStart';
import { toast } from 'react-toastify';

const ChatWindow: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [startVideoCall] = useMutation(START_VIDEO_CALL);
  const location = useLocation();
  if (!chatId) {
    return <div>Chat not found</div>;
  }
  const handlStartVideoCall = async () => {
    try {
      await startVideoCall({ variables: { chatId } });
    } catch (error) {
      toast.error('Failed to start video call');
    }
  };

  return (
    <div className="flex flex-col h-[95vh]">
      <div className="bg-gray-200 p-4">
        <h2 className="text-xl font-bold">
          <Link
            to={`/call/${chatId}`}
            onClick={handlStartVideoCall}
            state={{ backgroundLocation: location }}
          >
            <MdVideoCall className={'cursor-pointer'} size={35} />
          </Link>
        </h2>
      </div>
      <Messages chatId={chatId} />
      <MessageInput chatId={chatId} />
    </div>
  );
};

export default ChatWindow;
