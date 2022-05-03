import { useRef, useEffect } from 'react';

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import {
  Player,
  Hls,
  Video,
  DefaultUi,
  Controls,
  DefaultControls,
  PlaybackControl,
  Control,
} from '@vime/react';
import '@vime/core/themes/default.css';

export default function VideoPlayer({
  src,
  poster,
  previousCallback,
  nextCallback,
}) {
  const videoplayer = useRef(null);
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (
        document.activeElement === videoplayer.current ||
        videoplayer.current?.isFullscreenActive
      ) {
        switch (e.key) {
          // play-toggle
          case ' ':
          case 'k':
            e.preventDefault();
            if (videoplayer.current.paused) {
              videoplayer.current.play();
            } else {
              videoplayer.current.pause();
            }
            break;
          // fullscreen
          case 'f':
            if (e.key === 'f') {
              if (videoplayer.current?.isFullscreenActive) {
                videoplayer.current.exitFullscreen().then(() => {
                  videoplayer.current.focus();
                });
              } else {
                // enterFullscreen throws error if using the native api doesn't work.
                // After that, it will use the provider
                // so catching the error is unimportant
                videoplayer.current.enterFullscreen().catch(() => {
                  return null;
                });
              }
            }
            break;
          // volume up
          case 'ArrowUp':
            e.preventDefault();
            {
              const vol = videoplayer.current.volume;
              let nextVol = vol + 10;
              if (nextVol > 100) nextVol = 100;
              videoplayer.current.volume = nextVol;
            }
            break;
          // volume down
          case 'ArrowDown':
            e.preventDefault();
            {
              const vol = videoplayer.current.volume;
              let nextVol = vol - 10;
              if (nextVol < 0) nextVol = 0;
              videoplayer.current.volume = nextVol;
            }
            break;
          // previous episode
          case 'ArrowLeft':
            previousCallback();
            break;
          // next episode
          case 'ArrowRight':
            nextCallback();
            break;
          default:
            break;
        }
      }
    });
  }, [nextCallback, previousCallback]);
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

      <DefaultUi noControls>
        <DefaultControls hideOnMouseLeave activeDuration={1500} />

        <Controls
          justify="center"
          align="center"
          fullWidth
          pin="center"
          style={{
            '--vm-control-scale': 1.3,
            '--vm-controls-spacing': '80px',
          }}
          hideOnMouseLeave
          activeDuration={1500}
          waitForPlaybackStart
        >
          <Control>
            <ChevronDoubleLeftIcon className="text-white w-7" />
          </Control>

          <PlaybackControl hideTooltip />

          <Control>
            <ChevronDoubleRightIcon className="text-white w-7" />
          </Control>
        </Controls>
      </DefaultUi>
    </Player>
  );
}
