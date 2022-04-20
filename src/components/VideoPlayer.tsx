import { useEffect, useRef } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

import "video.js/dist/video-js.css";

type Props = {
  options?: VideoJsPlayerOptions;
};

const VideoPlayer = ({ options }: Props) => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const playerRef = useRef<null | VideoJsPlayer>(null);

  useEffect(() => {
    if (playerRef.current === null) {
      const videoElement = videoRef.current;

      if (videoElement === null) return;

      playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
      });
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player !== null) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />
    </div>
  );
};

export default VideoPlayer;
