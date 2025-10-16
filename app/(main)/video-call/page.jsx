import React from 'react';
import VideoCall from './_components/video-call';

const VideoCallPage = ({ searchParams }) => {
  // safely get sessionId and token
  const sessionId = searchParams?.sessionId || '';
  const token = searchParams?.token || '';

  return (
    <VideoCall 
      sessionId={sessionId}
      token={token}
    />
  );
};

export default VideoCallPage;
