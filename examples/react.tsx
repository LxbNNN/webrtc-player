import { useEffect, useState } from "react";
import WebrtcPlayer from "webrtc-player";

const VideoPlayer = () => {
  const [play, setPlay] = useState<WebrtcPlayer | null>(null);

  const createPlayer = () => {
    setPlay(() => {
      return new WebrtcPlayer({
        url: "webrtc://...", //webrtc 地址
        video: "media", // video标签id
        // streamingMediaType: 'srs', //如果是srs需要加上这个参数
        autoplay: true,
        onPlay: (e) => {
          console.log("开始播放", e);
        },
        onPause: (e) => {
          console.log("暂停", e);
        },
      });
    });
  };
  useEffect(() => {
    createPlayer();
  }, []);
  return <video id="media" width={400} height={400} controls />;
};

export default VideoPlayer;
