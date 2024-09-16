import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADD_LIKE_POST } from '../../graphql/mutations/AddLikePost';
import { ADD_MESSAGE_TO_CHAT } from '../../graphql/mutations/AddMessageToChat';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  chatId,
}) => {
  const [message, setMessage] = useState<string>('');
  const [createMessage] = useMutation(ADD_MESSAGE_TO_CHAT);
  const handleSend = async () => {
    if (message.trim()) {
      await createMessage({
        variables: {
          input: {
            chatId,
            content: message.trim(),
          },
        },
      })
        .then((res) => {
          console.log(res);
          onSendMessage(message.trim());
          setMessage('');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mesaj yaz..."
        className="w-full p-2 rounded-lg border"
      />
      <button
        onClick={handleSend}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Gönder
      </button>
    </div>
  );
};

export default MessageInput;
