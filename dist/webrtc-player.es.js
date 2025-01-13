var b = Object.defineProperty;
var P = (r, t, e) => t in r ? b(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var n = (r, t, e) => P(r, typeof t != "symbol" ? t + "" : t, e);
class I {
  constructor(t) {
    n(this, "webrtc", null);
    n(this, "options");
    n(this, "urlParams", {});
    n(this, "paused", !0);
    n(this, "animationId", null);
    n(this, "isPlaying", !1);
    this.options = t || {}, this.optionsError(), this.videoElementInit(), this.player();
  }
  videoElementInit() {
    typeof this.options.video == "string" && (this.options.video = document.getElementById(
      this.options.video
    )), this.options.video instanceof HTMLVideoElement && this.options.autoplay && (this.options.video.muted = !0);
  }
  player() {
    this.urlParams = this.parseUrl(this.options.url), this.webRTCConnection();
  }
  async sdpRequest(t) {
    let e = this;
    return new Promise(async (a, s) => {
      let l = e.urlParams.url, c = e.options.streamingMediaType === "srs" ? JSON.stringify({
        api: l,
        streamurl: e.urlParams.streamurl,
        clientip: null,
        sdp: t.sdp,
        tid: Number(
          parseInt(String((/* @__PURE__ */ new Date()).getTime() * Math.random() * 100))
        ).toString(16).slice(0, 7)
      }) : t.sdp;
      try {
        let p = await (await fetch(l, {
          method: "POST",
          body: c,
          headers: { "Content-Type": "application/json" }
        })).text(), o = "";
        if (p.startsWith("v="))
          o = p;
        else {
          const i = JSON.parse(p);
          "sdp" in i && (o = i.sdp);
        }
        o && o.includes("v=") ? a(o) : s(p);
      } catch (h) {
        s(h);
      }
    });
  }
  async webRTCConnection() {
    let t = this;
    t.webrtc && t.webrtc.close(), t.webrtc = new RTCPeerConnection(), t.webrtc.ontrack = function(s) {
      t.options.video.srcObject = s.streams[0];
    }, t.webrtc.addTransceiver("audio", { direction: "recvonly" }), t.webrtc.addTransceiver("video", { direction: "recvonly" });
    const e = await t.webrtc.createOffer();
    await t.webrtc.setLocalDescription(e);
    let a = await t.sdpRequest(e);
    await t.webrtc.setRemoteDescription(
      new RTCSessionDescription({ type: "answer", sdp: a })
    ), t.options.autoplay && t.play();
  }
  pause() {
    if (this.paused)
      return;
    this.animationId && cancelAnimationFrame(this.animationId), this.animationId = null, this.isPlaying = !1, this.paused = !0;
    let t = this.options.video;
    t.pause(), t.removeAttribute("src"), t.load(), this.options.onPause && this.options.onPause(this);
  }
  stop() {
    this.pause();
  }
  destroy() {
    this.pause(), this.webrtc && (this.webrtc.close(), this.webrtc.ontrack = null, this.webrtc = null), this.options = null;
  }
  update() {
    this.animationId = requestAnimationFrame(this.update.bind(this));
    let t = this.options.video;
    t.readyState < 4 || this.isPlaying || (this.isPlaying = !0, t.play(), this.options.onPlay && this.options.onPlay(this));
  }
  play() {
    this.animationId || (this.animationId = requestAnimationFrame(this.update.bind(this)), this.paused = !1);
  }
  parseUrl(t) {
    var m, f;
    const e = document.createElement("a");
    t = t.replace(/^(rtmp|webrtc|rtc):\/\//, "http://"), e.href = t;
    const a = e.pathname;
    let [s, l] = a.slice(1).split("/").reverse();
    s = s ? a.slice(1, a.lastIndexOf("/")) : "", s = s.replace("...vhost...", "?vhost=");
    let c = ((m = new URLSearchParams(s.split("?")[1] || "").get("vhost")) == null ? void 0 : m.split("&")[0]) || "";
    /^(\d{1,3}\.){3}\d{1,3}$/.test(e.hostname) && e.hostname === c && (c = "__defaultVhost__");
    const p = t.includes("://") ? t.split("://")[0] : "rtmp", o = e.port || 1985, i = {
      url: t,
      schema: p,
      server: e.hostname,
      port: o,
      vhost: c,
      app: s,
      stream: l
    };
    if (this.fillQuery(e.search, i), this.options.streamingMediaType === "srs") {
      i.streamurl = t;
      const d = ((f = i.query) == null ? void 0 : f.play) || "/rtc/v1/play/", w = d.endsWith("/") ? d : `${d}/`, v = `http://${i.server}:${o}${w}`, u = new URLSearchParams(i.query);
      u.delete("api"), u.delete("play"), i.url = `${v}?${u.toString()}`;
    }
    return i;
  }
  fillQuery(t, e) {
    e.query = {}, t.startsWith("?") && (t = t.slice(1));
    const a = new URLSearchParams(t);
    for (const [s, l] of a.entries())
      e.query[s] = l;
    e.domain && (e.vhost = e.domain);
  }
  optionsError() {
    if (!this.options.video || typeof this.options.video == "string" && !document.getElementById(this.options.video))
      throw "VideoElement is null";
    if (!this.options.url)
      throw "video url is null";
  }
}
export {
  I as default
};
