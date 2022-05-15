import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import {
  Controls,
  PlaybackControl,
  Control,
  Scrim,
  ScrubberControl,
  ControlSpacer,
  VolumeControl,
  SettingsControl,
  DefaultUi,
  FullscreenControl,
  CurrentTime,
  EndTime,
  ControlGroup,
  TimeProgress,
  PipControl,
  CaptionControl,
  Tooltip,
} from '@vime/react';

import useMediaQuery from '@hooks/useMediaQuery';

// export interface VideoControlsProps {
//   previousCallback: () => void;
//   nextCallback: () => void;
// }

// const VideoControls: React.FC<VideoControlsProps>
const VideoControls = ({ previousCallback, nextCallback }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <DefaultUi noControls>
      {/* Center Controls for play/pause and changing episode */}
      <Controls
        align="center"
        pin="center"
        justify="space-evenly"
        style={{
          '--vm-controls-spacing': '80px',
        }}
      >
        <Control onClick={previousCallback} keys="p" label="Previous Episode">
          <ChevronDoubleLeftIcon className="text-white w-9" />
          <Tooltip>previous(p)</Tooltip>
        </Control>

        <PlaybackControl hideTooltip keys="k/ " />

        <Control onClick={nextCallback} keys="n" label="Next Episode">
          <ChevronDoubleRightIcon className="text-white w-9" />
          <Tooltip className="text-xs">next(n)</Tooltip>
        </Control>
      </Controls>

      {/* Default Controls */}
      <Scrim gradient="up" />

      {isMobile && (
        <Controls pin="topLeft">
          <ControlSpacer />
          <VolumeControl />
          <SettingsControl />
        </Controls>
      )}

      <Controls
        pin="bottomLeft"
        direction={isMobile ? 'column' : 'column-reverse'}
      >
        <ControlGroup space={isMobile ? 'none' : 'top'}>
          {!isMobile && (
            <>
              <PlaybackControl keys="k/ " tooltipDirection="right" />
              <VolumeControl />
            </>
          )}

          {!isMobile ? (
            <>
              <TimeProgress />
              <ControlSpacer />
            </>
          ) : (
            <>
              <CurrentTime />
              <ControlSpacer />
              <EndTime />
            </>
          )}

          {!isMobile && (
            <>
              <CaptionControl />
              <PipControl keys="i" />
              <SettingsControl />
            </>
          )}

          <FullscreenControl tooltipDirection="left" />
        </ControlGroup>

        <ControlGroup>
          <ScrubberControl />
        </ControlGroup>
      </Controls>
    </DefaultUi>
  );
};

export default VideoControls;
