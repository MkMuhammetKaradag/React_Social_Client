import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { GET_USER_CHATS } from '../../graphql/queries/GetUserChats';
import ChatParticipantCard from './ChatParticipantCard';

interface Participant {
  userName: string;
  profilePhoto: string | null;
}

interface LastMessage {
  content: string;
  sender: {
    _id: string;
  };
}

interface ChatItem {
  _id: string;
  participants: Participant[];
  lastMessage: LastMessage | null;
}

const ChatList: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const { data, loading, error } = useQuery<{ getChats: ChatItem[] }>(GET_USER_CHATS);

  const renderedContent = useMemo(() => {
    if (loading) return <div className="p-4 text-center">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Hata: {error.message}</div>;
    if (!data?.getChats || data.getChats.length === 0) return <div className="p-4 text-center">Henüz sohbet yok</div>;

    return (
      <ul>
        {data.getChats.map((chat) => (
          <li key={chat._id}>
            <Link 
              to={`/direct/t/${chat._id}`} 
              className={`block p-1 mb-3 transition-colors ${chat._id === chatId ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <ChatParticipantCard
                participants={chat.participants}
                status={chat._id === chatId}
                lastMessage={chat.lastMessage}
              />
            </Link>
          </li>
        ))}
      </ul>
    );
  }, [data, loading, error, chatId]);

  return (
    <div className="h-[95vh] overflow-y-auto">
      <h2 className="text-xl font-bold p-4 sticky top-0 bg-white z-10 border-b">Mesajlar</h2>
      {renderedContent}
    </div>
  );
};

export default React.memo(ChatList);