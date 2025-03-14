import React from 'react';
import './ParagraphVideo.css';

const ParagraphVideo = ({ video }) => {
  return (
    <div className="video">
      {video && video.__typename === 'MediaRemoteVideo' && (
        <div dangerouslySetInnerHTML={{ __html: video.mediaOembedVideo }} />
      )}
      {video && video.__typename === 'MediaVideo' && video.mediaVideoFile && (
        <video controls>
          <source src={video.mediaVideoFile.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default ParagraphVideo; 