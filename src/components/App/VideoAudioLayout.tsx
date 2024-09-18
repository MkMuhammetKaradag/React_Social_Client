import {
  AudioTrack,
  isTrackReference,
  TrackMutedIndicator,
  TrackReference,
  TrackReferenceOrPlaceholder,
  VideoTrack,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import React, { useState } from 'react';

// Adjust these imports and types based on your actual library and setup

// Define types for your track references and sources

// Define props interface for the component
interface VideoAudioLayoutProps {
  participantTracks: (TrackReference | null)[];
}

const VideoAudioLayout: React.FC<VideoAudioLayoutProps> = ({
  participantTracks,
}) => {
  // Type guard function
  const isTrackReference = (
    track: TrackReference | null
  ): track is TrackReference => {
    return track !== null && 'source' in track;
  };

  // Separate video and audio tracks
  const videoTracks = participantTracks.filter(
    (trackRef) =>
      isTrackReference(trackRef) &&
      (trackRef.source === Track.Source.Camera ||
        trackRef.source === Track.Source.ScreenShare)
  ) as TrackReference[];

  const audioTrack = participantTracks.find(
    (trackRef) =>
      isTrackReference(trackRef) && trackRef.source === Track.Source.Microphone
  ) as TrackReference | undefined;

  return (
    <div className="flex flex-col">
      {/* Video tracks row */}
      <div className="flex flex-row space-x-2 mb-2">
        {videoTracks.map((trackRef, index) => (
          <div key={index} className="flex-1">
            {trackRef.source === Track.Source.Camera && (
              <VideoTrack className="z-0 w-full h-full" trackRef={trackRef} />
            )}
            {trackRef.source === Track.Source.ScreenShare && (
              <VideoTrack className="z-0 w-full h-full" trackRef={trackRef} />
            )}
          </div>
        ))}
        {videoTracks.length === 0 && <p>Camera placeholder</p>}
      </div>

      {/* Audio control row */}
      {audioTrack && (
        <div className="w-full flex">
          <AudiControl trackRef={audioTrack} />
          <TrackMutedIndicator
            trackRef={{
              participant: audioTrack.participant,
              source: Track.Source.Microphone,
            }}
          />
          <TrackMutedIndicator
            trackRef={{
              participant: audioTrack.participant,
              source: Track.Source.Camera,
            }}
          />
        </div>
      )}
    </div>
  );
};
interface AudiControlProps {
  trackRef: TrackReferenceOrPlaceholder;
}
const AudiControl: React.FC<AudiControlProps> = ({ trackRef }) => {
  const [volume, setVolume] = useState(0.9);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };
  return (
    <div>
      {isTrackReference(trackRef) ? (
        <>
          {trackRef.source === Track.Source.Microphone && (
            <div>
              <AudioTrack trackRef={trackRef} volume={volume} muted={false} />
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          )}
        </>
      ) : (
        <p>Camera placeholder</p>
      )}
    </div>
  );
};
export default VideoAudioLayout;
