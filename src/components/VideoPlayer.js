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
import { useRef } from 'react';

function ControlIcon({ icon, onClick }) {
  const HeroIcon = icon;
  return (
    <Control onClick={onClick}>
      <HeroIcon className="text-white w-7" />
    </Control>
  );
}

export default function VideoPlayer({
  src,
  poster,
  previousCallback,
  nextCallback,
}) {
  const videoplayer = useRef(null);
  
  document.addEventListener( 'keydown', function( event ) {

    // play-toggle
    if ( event.key === ' ' || event.key === 'k' ) {
      if(videoplayer.current.paused) {
        videoplayer.current.play()
      }
      else {
        videoplayer.current.pause()
      }
    }

    // fullscreen
    if ( event.key === 'f' ) {
      if(videoplayer.isFullscreenActive) {
        videoplayer.current.exitFullscreen();
      }
      else {
        videoplayer.current.enterFullscreen();
      }
    }

    // volume up
    if ( event.key === 'ArrowUp' ) {
      let vol = videoplayer.current.volume;
      let nextVol = vol + 10;
      if( nextVol > 100) 
        nextVol = 100;
      videoplayer.current.volume = nextVol;
    }

    // volume down
    if ( event.key === 'ArrowDown' ) {
      let vol = videoplayer.current.volume;
      let nextVol = vol - 10;
      if( nextVol < 0) 
        nextVol = 0;
      videoplayer.current.volume = nextVol;
    }

    // previous episode
    if ( event.key === 'ArrowLeft' ) {
      previousCallback();
    }

    // next episode
    if ( event.key === 'ArrowRight' ) {
      nextCallback();
    }
  });
  return (
    <Player ref={videoplayer}>
      {src.includes('m3u8') ? (
        <Hls version="latest" poster={poster} key={src}>
          <source data-src={src} type="application/x-mpegURL" />
        </Hls>
      ) : (
        <Video version="latest" poster={poster} key={src}>
          <source data-src={src} type="video/mp4" />
        </Video>
      )}

      <DefaultUi noCaptions noControls>
        <DefaultControls hideOnMouseLeave activeDuration={1500} />

        <Controls
          fullWidth
          pin="center"
          style={{ '--vm-control-scale': 1.5 }}
          hideOnMouseLeave
          activeDuration={1500}
        >
          <div className="flex mx-auto items-center space-x-24 md:space-x-32">
            <ControlIcon
              icon={ChevronDoubleLeftIcon}
              onClick={previousCallback}
            />
            <PlaybackControl hideTooltip />
            <ControlIcon icon={ChevronDoubleRightIcon} onClick={nextCallback} />
          </div>
        </Controls>
      </DefaultUi>
    </Player>
  );
}
