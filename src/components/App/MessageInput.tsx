import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_MESSAGE_TO_CHAT } from '../../graphql/mutations/AddMessageToChat';
import { toast } from 'react-toastify';

interface MessageInputProps {
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState<string>('');
  const [createMessage, { loading }] = useMutation(ADD_MESSAGE_TO_CHAT);

  const handleSend = useCallback(async () => {
    if (message.trim() && !loading) {
      try {
        await createMessage({
          variables: {
            input: {
              chatId,
              content: message.trim(),
            },
          },
        });
        setMessage('');
      } catch (err) {
        console.error('Mesaj gönderme hatası:', err);
        toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    }
  }, [message, chatId, createMessage, loading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-100 p-4 flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Mesaj yaz..."
        className="flex-grow p-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
        disabled={loading}
      />
      <button
        onClick={handleSend}
        className={`p-2 bg-blue-500 text-white rounded-r-lg transition-colors ${
          loading || !message.trim()
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-600'
        }`}
        disabled={loading || !message.trim()}
      >
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </div>
  );
};

export default React.memo(MessageInput);
