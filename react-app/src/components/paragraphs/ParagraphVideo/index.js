import React, { useState, useEffect, useRef } from 'react';
import './ParagraphVideo.css';

const ParagraphVideo = ({ video }) => {
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (video && video.__typename === 'MediaRemoteVideo' && video.mediaOembedVideo) {
      // Extract YouTube video ID from oEmbed data or URL
      const extractYoutubeId = (url) => {
        // Handle both youtube.com and youtu.be URLs
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      // Try to extract from URL-like string
      const urlMatch = video.mediaOembedVideo.match(/(https?:\/\/[^\s]+)/g);
      if (urlMatch) {
        const potentialUrl = urlMatch[0];
        const id = extractYoutubeId(potentialUrl);
        if (id) {
          setVideoId(id);
        }
      } else if (video.mediaOembedVideo.includes('youtube.com/watch?v=') || 
                video.mediaOembedVideo.includes('youtu.be/')) {
        setVideoId(extractYoutubeId(video.mediaOembedVideo));
      }
    }
  }, [video]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Add event listeners for video state changes
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [videoRef]);

  return (
    <div className="video-container">
      {video && video.__typename === 'MediaRemoteVideo' && (
        <>
          {videoId ? (
            <div 
              ref={wrapperRef}
              className="video-wrapper"
            >
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: video.mediaOembedVideo }} />
          )}
        </>
      )}
      {video && video.__typename === 'MediaVideo' && video.mediaVideoFile && (
        <div 
          className={`video-wrapper ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayClick}
        >
          <div className="video-overlay">
            <div className="play-button">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 7.5V16.5L16.5 12L9.5 7.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stop-button">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="7" width="10" height="10" rx="1" fill="white" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <video ref={videoRef} playsInline>
            <source src={video.mediaVideoFile.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default ParagraphVideo; 