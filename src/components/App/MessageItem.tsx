// MessageItem.tsx (yeni dosya)
import React from 'react';
import { Message } from '../../utils/types';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ message, isCurrentUser }) => (
    <div
      className={`mb-2 p-2 space-x-2 flex ${
        isCurrentUser ? 'justify-end' : ''
      }`}
    >
      {!isCurrentUser && (
        <img
          src={message.sender.profilePhoto || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div
        className={`${
          isCurrentUser
            ? 'rounded-tl-xl bg-sky-100 text-gray-900'
            : 'rounded-tr-xl bg-slate-100'
        } p-2 shadow rounded-b-xl`}
      >
        {!isCurrentUser && (
          <span className="font-semibold">{message.sender.userName}</span>
        )}
        <p className="mt-2">{message.content}</p>
      </div>
    </div>
  )
);

export default MessageItem;
