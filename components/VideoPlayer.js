import {
  Player,
  DefaultUi,
  Hls,
  Controls,
  DefaultControls,
  PlaybackControl,
  Control
} from '@vime/react';
import '@vime/core/themes/default.css';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';

function ControlIcon({ icon, onClick }) {
  const HeroIcon = icon
  return (
    <Control onClick={onClick}>
      <HeroIcon className='text-white w-12 p-1.5' />
    </Control>
  )
}

export default function VideoPlayer({ src, poster, previousCallback, nextCallback }) {
  return (
    <Player>
      <Hls version="latest" poster={poster} key={src}>
        <source src={src} type="application/x-mpegURL" />
      </Hls>

      <DefaultUi noControls>
        <DefaultControls hideOnMouseLeave activeDuration={1500} />

        <Controls fullwidth pin="center" hideOnMouseLeave activeDuration={1500}>
          <div className="flex space-x-32 items-center mx-auto">
            <ControlIcon icon={ChevronDoubleLeftIcon} onClick={previousCallback} />
            <PlaybackControl hideTooltip style={{ '--vm-control-scale': 1.7 }} />            
            <ControlIcon icon={ChevronDoubleRightIcon} onClick={nextCallback} />
          </div>
        </Controls>
      </DefaultUi>
    </Player>
  );
}
