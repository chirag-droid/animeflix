import { useRef, useEffect, ReactEventHandler } from 'react';

import { Player, Hls, Video } from '@vime/react';

import '@vime/core/themes/default.css';
import useStream from '@hooks/useStream';
import { proxyUrl } from '@utility/utils';

import VideoControls from './VideoControls';

export interface VideoPlayerProps {
  src: string;
  referer: string;
  poster: string;
  shouldUseProxy: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  referer,
  poster,
  shouldUseProxy,
}) => {
  const [animeId, episode] = useStream((store) => [
    store.animeId,
    store.episode,
  ]);
  const startTime = useStream((store) => store.time);

  const videoSrc = shouldUseProxy ? proxyUrl(src, referer) : src;

  const videoplayer = useRef<HTMLVmPlayerElement>(null);

  // Workaround for keyboard shortcuts not working
  useEffect(() => {
    // focus on videoplayer by default
    videoplayer.current.focus();

    // prevent default actions
    videoplayer.current.addEventListener('keydown', (e) => {
      e.preventDefault();
    });

    // Refocus on the videoplayer on fullscreen change
    videoplayer.current.onfullscreenchange = () => {
      videoplayer.current.focus();
    };

    // Enable fullscreen keyboard shortcuts in fullscreen
    document.addEventListener('keydown', (e) => {
      if (
        videoplayer.current?.isFullscreenActive &&
        e.target !== videoplayer.current
      ) {
        // Create a new keyboard event
        const keyboardEvent = new KeyboardEvent('keydown', {
          key: e.key,
          code: e.code,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
        });

        // dispatch it to the videoplayer
        videoplayer.current.dispatchEvent(keyboardEvent);
      }
    });
  });

  const timeUpdateCallback: ReactEventHandler<HTMLVmPlayerElement> = (e) => {
    if (videoplayer.current.duration < 0) return;

    if (e.timeStamp / videoplayer.current.duration >= 0.99) {
      localStorage.removeItem(`Anime${animeId}`);
      return;
    }

    localStorage.setItem(`Anime${animeId}`, `${episode}-${e.timeStamp}`);
  };

  return (
    <Player
      onTimeUpdate={timeUpdateCallback}
      ref={videoplayer}
      tabIndex={0}
      style={{ outline: 'none' }}
      onVmPlaybackReady={() => {
        videoplayer.current.currentTime = startTime;
      }}
    >
      {videoSrc && videoSrc.includes('m3u8') ? (
        <Hls version="latest" poster={poster} key={videoSrc}>
          <source data-src={videoSrc} type="application/x-mpegURL" />
        </Hls>
      ) : (
        <Video poster={poster} key={videoSrc}>
          <source data-src={videoSrc} type="video/mp4" />
        </Video>
      )}

      <VideoControls />
    </Player>
  );
};

export default VideoPlayer;
