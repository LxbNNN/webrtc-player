import type { Options, Ret, WebrtcPlayer } from "./types";

class webrtcPlayer implements WebrtcPlayer {
  webrtc: null | RTCPeerConnection = null;
  options: Options;
  urlParams: Ret = {};
  paused: boolean = true;
  animationId: number | null = null;
  isPlaying: boolean = false;

  constructor(options: Options) {
    this.options = options || {};
    this.optionsError();
    this.videoElementInit();
    this.player();
  }
  videoElementInit() {
    if (typeof this.options.video === "string") {
      this.options.video = document.getElementById(
        this.options.video
      ) as HTMLVideoElement;
    }
    if (this.options.video instanceof HTMLVideoElement) {
      if (this.options.autoplay) {
        this.options.video.muted = true;
      }
    }
  }
  player() {
    this.urlParams = this.parseUrl(this.options.url);
    this.webRTCConnection();
  }
  async sdpRequest(offer: RTCSessionDescriptionInit): Promise<string> {
    let that = this;
    return new Promise(async (resolve, reject) => {
      let url = that.urlParams.url as string;
      let isSrs = that.options.streamingMediaType === "srs";
      let data = isSrs
        ? JSON.stringify({
            api: url,
            streamurl: that.urlParams.streamurl,
            clientip: null,
            sdp: offer.sdp,
            tid: Number(
              parseInt(String(new Date().getTime() * Math.random() * 100))
            )
              .toString(16)
              .slice(0, 7),
          })
        : offer.sdp;
      try {
        let res = await fetch(url, {
          method: "POST",
          body: data,
          headers: { "Content-Type": "application/json" },
        });
        let res2 = await res.text();
        let answer: string = "";
        if (res2.startsWith("v=")) {
          answer = res2;
        } else {
          const parsedRes = JSON.parse(res2);
          if ("sdp" in parsedRes) {
            answer = parsedRes.sdp;
          }
        }
        if (answer && answer.includes("v=")) {
          resolve(answer);
        } else {
          reject(res2);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async webRTCConnection() {
    let that = this;
    if (that.webrtc) {
      that.webrtc.close();
    }
    that.webrtc = new RTCPeerConnection();
    that.webrtc.ontrack = function (event) {
      (that.options.video as HTMLVideoElement)["srcObject"] = event.streams[0];
    };
    that.webrtc.addTransceiver("audio", { direction: "recvonly" });
    that.webrtc.addTransceiver("video", { direction: "recvonly" });
    const offer = await that.webrtc.createOffer();
    await that.webrtc.setLocalDescription(offer);

    let answer = await that.sdpRequest(offer);
    await that.webrtc.setRemoteDescription(
      new RTCSessionDescription({ type: "answer", sdp: answer })
    );
    if (that.options.autoplay) {
      that.play();
    }
  }

  pause() {
    if (this.paused) {
      return;
    }
    this.animationId && cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.isPlaying = false;
    this.paused = true;
    let video = this.options.video as HTMLVideoElement;
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (this.options.onPause) {
      this.options.onPause(this);
    }
  }
  stop() {
    this.pause();
  }
  destroy() {
    this.pause();
    if (this.webrtc) {
      this.webrtc.close();
      this.webrtc.ontrack = null;
      this.webrtc = null;
    }
    (this.options as unknown as null) = null;
  }

  update() {
    this.animationId = requestAnimationFrame(this.update.bind(this));
    let video = this.options.video as HTMLVideoElement;
    if (video.readyState < 4) {
      return;
    }
    if (!this.isPlaying) {
      this.isPlaying = true;
      video.play();
      if (this.options.onPlay) {
        this.options.onPlay(this);
      }
    }
  }
  play() {
    if (this.animationId) {
      return;
    }
    this.animationId = requestAnimationFrame(this.update.bind(this));
    this.paused = false;
  }

  parseUrl(url: string) {
    // 创建并配置 URL 对象
    const a = document.createElement("a");
    url = url.replace(/^(rtmp|webrtc|rtc):\/\//, "http://");
    a.href = url;

    // 提取路径、应用名和流名
    const path = a.pathname;
    let [app, stream] = path.slice(1).split("/").reverse();
    app = app ? path.slice(1, path.lastIndexOf("/")) : "";

    // 处理 vhost 参数
    app = app.replace("...vhost...", "?vhost=");
    const params = new URLSearchParams(app.split("?")[1] || "");
    let vhost = params.get("vhost")?.split("&")[0] || "";

    // 处理 vhost 的特殊情况
    const re = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (re.test(a.hostname) && a.hostname === vhost) {
      vhost = "__defaultVhost__";
    }

    // 确定协议和端口
    const schema = url.includes("://") ? url.split("://")[0] : "rtmp";
    const port = a.port || 1985;

    // 构造返回对象
    const ret: Ret = {
      url,
      schema,
      server: a.hostname,
      port,
      vhost,
      app,
      stream,
    };

    // 填充查询参数
    this.fillQuery(a.search, ret);

    // 如果是 SRS ，调整 URL
    if (this.options.streamingMediaType === "srs") {
      ret.streamurl = url;
      const baseApi = ret.query?.play || "/rtc/v1/play/";
      const api = baseApi.endsWith("/") ? baseApi : `${baseApi}/`;
      const baseUrl = `http://${ret.server}:${port}${api}`;
      const queryParams = new URLSearchParams(ret.query);
      queryParams.delete("api");
      queryParams.delete("play");
      ret.url = `${baseUrl}?${queryParams.toString()}`;
    }

    return ret;
  }

  fillQuery(queryString: string, obj: Ret): void {
    obj.query = {};
    // 处理查询字符串
    if (queryString.startsWith("?")) {
      queryString = queryString.slice(1);
    }
    // 解析查询字符串
    const queries = new URLSearchParams(queryString);
    for (const [key, value] of queries.entries()) {
      obj.query[key] = value;
    }
    // 更新 vhost
    if (obj.domain) {
      obj.vhost = obj.domain;
    }
  }

  optionsError() {
    if (!this.options.video) {
      throw "VideoElement is null";
    }
    if (
      typeof this.options.video === "string" &&
      !document.getElementById(this.options.video)
    ) {
      throw "VideoElement is null";
    }
    if (!this.options.url) {
      throw "video url is null";
    }
  }
}
export default webrtcPlayer;
