import { Player, DefaultUi, Hls } from '@vime/react';
import '@vime/core/themes/default.css';

export default function VideoPlayer({ src, poster }) {
  return (
    <Player key={src}>
      <Hls version="latest" poster={poster}>
        <source src={src} type="application/x-mpegURL" />
      </Hls>

      <DefaultUi />
    </Player>
  );
}
