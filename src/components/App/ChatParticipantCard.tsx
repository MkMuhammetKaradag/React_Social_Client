import React from 'react';

interface Participant {
  profilePhoto: string | null;
  userName: string;
}

interface ChatParticipantCardProps {
  participants: Participant[];
  status: boolean;
  lastMessage: {
    content: string;
    sender: {
      _id: string;
    };
  } | null;
}

const ChatParticipantCard: React.FC<ChatParticipantCardProps> = React.memo(
  ({ participants, status, lastMessage }) => {
    const isGroupChat = participants.length > 1;
    const displayParticipants = participants.slice(0, 3);
    const remainingParticipants = participants.length - 3;

    const renderParticipantImages = () => (
      <div className="flex -space-x-3">
        {displayParticipants.map((participant, index) => (
          <img
            key={index}
            src={participant.profilePhoto || 'https://via.placeholder.com/40'}
            alt={participant.userName}
            className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
            style={{ zIndex: 3 - index }}
          />
        ))}
        {remainingParticipants > 0 && (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-500 text-white text-sm font-bold border-2 border-gray-800">
            +{remainingParticipants}
          </div>
        )}
      </div>
    );

    const renderChatInfo = () => (
      <div className="ml-4 flex-grow overflow-hidden">
        <h3 className="font-bold text-gray-800 truncate">
          {isGroupChat ? 'Grup' : participants[0].userName}
        </h3>
        {lastMessage && (
          <p className="text-gray-600 text-sm truncate">
            {lastMessage.content}
          </p>
        )}
      </div>
    );

    return (
      <div
        className={`flex items-center p-4 rounded-lg shadow-md transition-colors duration-200 ${
          status ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
      >
        {isGroupChat ? (
          renderParticipantImages()
        ) : (
          <img
            src={
              participants[0].profilePhoto || 'https://via.placeholder.com/40'
            }
            alt={participants[0].userName}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        {renderChatInfo()}
      </div>
    );
  }
);

export default ChatParticipantCard;
