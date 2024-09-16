import React from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

const ChatWindow: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

  const messages: Message[] = [
    {
      id: '1',
      text: 'Merhaba',
      sender: 'other',
      timestamp: '14.08.2020 23:33',
    },
    { id: '2', text: 'Selam!', sender: 'me', timestamp: '17.01.2023 21:13' },
    // Diğer mesajları buraya ekleyin
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-200 p-4">
        <h2 className="text-xl font-bold">Chat ID: {chatId}</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === 'me' ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 p-4">
        <input
          type="text"
          placeholder="Mesaj yaz..."
          className="w-full p-2 rounded-lg border"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
