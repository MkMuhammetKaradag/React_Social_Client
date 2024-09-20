import React from 'react';
import { Media } from '../../utils/types';

const MediaItem: React.FC<{ media: Media; rowSpan: boolean }> = ({
  media,
  rowSpan,
}) => {
  if (media.type === 'VIDEO') {
    return (
      <video
        src={`https://res.cloudinary.com/doarbqecd/video/upload/c_fill,w_300,h_${
          rowSpan ? '600' : '300'
        }/v1725363937/posts/${media.publicId}`}
        className="w-full h-full object-cover"
        autoPlay={false}
      />
    );
  } else {
    return (
      <img
        src={`https://res.cloudinary.com/doarbqecd/image/upload/c_fill,w_300,h_${
          rowSpan ? '600' : '300'
        }/v1725363937/posts/${media.publicId}`}
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }
};

export default MediaItem;
