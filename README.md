# webrtcPlayer

webrtcPlayer.js是基于webrtc协议的播放器 兼容各主流流媒体webrtc协议 SRS、ZLM、M7s等

webrtcPlayer.js 基于 [JSWebrtc.js](https://github.com/kernelj/jswebrtc?tab=readme-ov-file) 改造而来。

# 使用说明
1.安装
````shell
npm i webrtc-player
````
2.创建video标签
````html
  <video id="media" src="" muted controls></video>
````
3.在js中引入 创建实例：
````js
import webrtcPlayer  from 'webrtc-player'

let play;
        play = new webrtcPlayer({
            url: 'webrtc://',
            video: "media",
            // streamingMediaType: 'srs', //如果是srs需要加上这个参数
            autoplay: true,
            onPlay: (e) => {
                console.log('开始播放', e);
            },
            onPause: (e) => {
                console.log('暂停', e);
            }
})

````

# Optinos 
webrtcPlayer(`optinos`)
| 参数 | 说明 | 类型 |可选值 | 默认值
| --- | --- | - | - | - |
| url | 视频地址 | string | - | - |
| autoplay | 是否自动播放  | boolean | - | - |
| streamingMediaType | 流媒体类型(srs必传，其他流媒体可不传)  |  string | 'srs'｜'m7s'...| - |
| onPlay | 视频开始播放回调  | Function | - | - |
| onPause | 视频暂停播放回调  | Function | - | - |


# Events 

| 事件名称 | 说明 | 回调参数
| --- | --- | ---|
| play | 播放 | -
| stop | 暂停 | -
| destroy | 销毁(在外部定义变量赋值时 let play = new webrtcPlayer(options) 在调用destroy后 将play也置为null play=null) | -

# 构建

````shell
npm run build

yarn build

pnpm build

````






