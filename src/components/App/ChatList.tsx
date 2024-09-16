import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
}

const ChatList: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();


  
  const chats: ChatItem[] = [
    {
      id: '1',
      name: 'Furkan Yasin Engin',
      lastMessage: 'Furkan bir dosya eki gönderdi.',
    },
    // Diğer sohbetleri buraya ekleyin
  ];

  return (
    <div className="h-[95vh] overflow-y-auto">
      <h2 className="text-xl font-bold p-4">Mesajlar</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link
              to={`/messages/${chat.id}`}
              className={`block p-4 hover:bg-gray-200 ${
                chat.id === chatId ? 'bg-blue-100' : ''
              }`}
            >
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-600">{chat.lastMessage}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
