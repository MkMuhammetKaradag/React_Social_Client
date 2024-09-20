// Stage.tsx
import React from 'react';
import { useParticipants } from '@livekit/components-react';
import CusParticipant from './CusParticipant';

const Stage: React.FC = () => {
  const participants = useParticipants();

  return (
    <div>
      <h2>Katılımcılar</h2>
      <div className="grid grid-cols-2 gap-2">
        {participants.map((participant) => (
          <CusParticipant key={participant.sid} participant={participant} />
        ))}
      </div>
    </div>
  );
};

export default Stage;
