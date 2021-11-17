import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export default function VideoPlayer({ src, headers }) {
  const videoRef = useRef(null)

  const config = {
    xhrSetup: function (xhr, url) {
      console.log(headers)
      headers.forEach(header => {
        header = header.split(" ")
        xhr.setRequestHeader(header[0], header[1])
      });
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.controls = true
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // This will run in safari, where HLS is supported natively
      video.src = src
    } else if (Hls.isSupported()) {
      // This will run in all other modern browsers
      const hls = new Hls(config)
      hls.loadSource(src)
      hls.attachMedia(video)
    } else {
      console.error(
        'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API'
      )
    }
  }, [src, videoRef])

  return (
    <>
      <video ref={videoRef} />
      <style jsx>{`
        video {
          max-width: 100%;
        }
      `}</style>
    </>
  )
}