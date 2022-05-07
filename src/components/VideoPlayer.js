import { useRef, useEffect } from 'react';

import { Player, Hls, Video } from '@vime/react';

import '@vime/core/themes/default.css';
import VideoControls from './VideoControls';

export default function VideoPlayer({
  src,
  poster,
  previousCallback,
  nextCallback,
}) {
  const videoplayer = useRef(null);

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

  return (
    <Player ref={videoplayer} tabIndex="0" style={{ outline: 'none' }}>
      {src.includes('m3u8') ? (
        <Hls version="latest" poster={poster} key={src}>
          <source data-src={src} type="application/x-mpegURL" />
        </Hls>
      ) : (
        <Video version="latest" poster={poster} key={src}>
          <source data-src={src} type="video/mp4" />
        </Video>
      )}

      <VideoControls
        nextCallback={nextCallback}
        previousCallback={previousCallback}
      />
    </Player>
  );
}
