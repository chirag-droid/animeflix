import { useEffect, useState } from 'react'
import { Player, DefaultUi, Hls } from '@vime/react';

export default function VideoPlayer({ src, headers }) {
  const [source, setSource] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = {
    xhrSetup: function (xhr, _url) {
      console.log(headers)
      headers.forEach(header => {
        header = header.split(" ")
        xhr.setRequestHeader(header[0], header[1])
      });
    }
  }

  useEffect(() => {
    setSource(src)
  }, [src])

  return (
    <Player>
      <Hls version="latest" config={config} poster="/media/poster.png">
        <source src={source} type="application/x-mpegURL" />
      </Hls>

      <DefaultUi>
      </DefaultUi>
    </Player>
  );
}