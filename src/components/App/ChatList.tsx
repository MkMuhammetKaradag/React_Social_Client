import { useQuery } from '@apollo/client';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { GET_USER_CHATS } from '../../graphql/queries/GetUserChats';
import ChatParticipantCard from './ChatParticipantCard';

interface participant {
  userName: string;
  profilePhoto: string | null;
}
interface lastMessage {
  content: string;
  sender: {
    _id: string;
  };
}

interface ChatItem {
  _id: string;
  participants: participant[];
  lastMessage: lastMessage | null;
}

const ChatList: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

  const { data, loading, error } = useQuery(GET_USER_CHATS);

  if (loading) {
    return <div>Loadding</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  if (!data.getChats) {
    return <div>No chats</div>;
  }
  const chats = data.getChats as ChatItem[];

  return (
    <div className="h-[95vh] overflow-y-auto">
      <h2 className="text-xl font-bold p-4">Mesajlar</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id}>
            <Link to={`/direct/t/${chat._id}`} className={`block p-4  `}>
              <ChatParticipantCard
                participants={chat.participants}
                status={chat._id === chatId}
              ></ChatParticipantCard>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
