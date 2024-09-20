// CusParticipant.tsx
import React from 'react';
import { useParticipantTracks } from '@livekit/components-react';
import { Track, Participant } from 'livekit-client';
import VideoAudioLayout from '../../components/App/VideoAudioLayout';

interface CusParticipantProps {
  participant: Participant;
}

const CusParticipant: React.FC<CusParticipantProps> = ({ participant }) => {
  const participantTracks = useParticipantTracks(
    [Track.Source.ScreenShare, Track.Source.Camera, Track.Source.Microphone],
    participant.identity
  );

  return (
    <div className="z-0 col-span-1">
      <VideoAudioLayout participantTracks={participantTracks} />
    </div>
  );
};

export default CusParticipant;
