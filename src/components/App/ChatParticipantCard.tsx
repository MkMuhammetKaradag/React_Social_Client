import React from 'react';

interface Participant {
  profilePhoto: string | null;
  userName: string;
}

interface ChatParticipantCardProps {
  participants: Participant[];
  status: boolean;
}

const ChatParticipantCard: React.FC<ChatParticipantCardProps> = ({
  participants,
  status,
}) => {
  const displayParticipants = participants.slice(0, 3); // Maksimum 3 katılımcı
  const remainingParticipants = participants.length - 3;

  return (
    <div
      className={`flex items-center p-4    rounded-lg shadow-md
        ${status ? 'bg-blue-100 ' : 'hover:bg-gray-100'}
    `}
    >
      {participants.length === 1 ? (
        <div className="flex items-center">
          <img
            src={
              participants[0].profilePhoto || 'https://via.placeholder.com/40'
            }
            alt={participants[0].userName}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4">
            <h3 className=" font-bold">{participants[0].userName}</h3>
            <p className="text-gray-400">{status}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex -space-x-3">
            {displayParticipants.map((participant, index) => (
              <img
                key={index}
                src={
                  participant.profilePhoto || 'https://via.placeholder.com/40'
                }
                alt={participant.userName}
                className="w-10 h-10 rounded-full border-2 border-gray-800"
                style={{ zIndex: 3 - index }} // Profil resimlerini iç içe geçirme
              />
            ))}
            {remainingParticipants > 0 && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-500 text-white text-sm font-bold border-2 border-gray-800">
                +{remainingParticipants}
              </div>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-white font-bold">Group</h3>
            <p className="text-gray-400">{status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatParticipantCard;
