import React from 'react';
import { useParams } from 'react-router-dom';
import Messages from '../../components/App/Messages';
import MessageInput from '../../components/App/MessageInput';

const ChatWindow: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

  const handleSendMessage = (content: string) => {
    // Handle sending the message here
    console.log('Sending message:', content);
    // You would typically call a mutation to send the message here
  };
  if (!chatId) {
    return <div>Chat not found</div>;
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-200 p-4">
        <h2 className="text-xl font-bold">Chat ID: {chatId}</h2>
      </div>
      <Messages chatId={chatId} onSendMessage={handleSendMessage} />
      <MessageInput chatId={chatId} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
