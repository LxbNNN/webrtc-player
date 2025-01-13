<template>
  <div>
    <video id="media" :width="400" :height="400" controls />
  </div>
</template>

<script setup lang="ts">
import WebrtcPlayer from "webrtc-player"; // npm i  webrtc-player
import { ref, onMounted } from "vue";

const play = ref<WebrtcPlayer | null>(null);

const createVideo = () => {
  play.value = new WebrtcPlayer({
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
};

onMounted(() => {
  createVideo();
});
</script>
