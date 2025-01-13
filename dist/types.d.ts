export type Options = {
    url: string;
    video: HTMLVideoElement | string | null;
    autoplay: boolean;
    streamingMediaType?: string;
    onPlay?: (webrtcPlayer: WebrtcPlayer) => void;
    onPause?: (webrtcPlayer: WebrtcPlayer) => void;
};
export interface Ret {
    url?: string;
    schema?: string;
    server?: string;
    port?: string | number;
    vhost?: string;
    app?: string;
    stream?: string;
    query?: Record<string, string>;
    domain?: string;
    streamurl?: string;
}
export interface WebrtcPlayer {
    /**
     * RTCPeerConnection 实例
     */
    webrtc: null | RTCPeerConnection;
    /**
     * 配置参数
     *
     * url: 视频地址
     *
     * video: 视频dom或者dom id
     *
     * autoplay: 是否自动播放
     *
     * streamingMediaType: 流媒体类型
     *
     * onPlay: 视频开始播放回调
     *
     * onPause: 视频暂停播放回调
     */
    options: Options;
    /**
     * 视频地址解析对象
     */
    urlParams: Ret;
    /**
     * 是否暂停
     */
    paused: boolean;
    /**
     * 视频帧 动画id
     */
    animationId: number | null;
    /**
     * 是否播放
     */
    isPlaying: boolean;
    /**
     * 初始化video DOM
     *
     * 💡 如果传入DOM Id document.getElementById 查找dom并赋值
     *
     * 💡 根据options设置video基础属性
     */
    videoElementInit: () => void;
    /**
     * 播放
     *
     * 💡 urlParams赋值
     *
     * 💡 执行 webRTCConnection
     */
    player: () => void;
    /**
     * 信令交换请求
     *
     * 💡 请求参数根据流媒体区分 srs是单独的请求体 其余流媒体是 sdp offer
     * @param offer  SDP offer
     * @returns SDP answer
     */
    sdpRequest: (offer: RTCSessionDescriptionInit) => Promise<string>;
    /**
     * webrtc 连接
     *
     * RTCPeerConnection 请求交换
     */
    webRTCConnection: () => Promise<void>;
    /**
     * 视频播放暂停事件
     *
     * 💡 内部暂停后 会回调options.onPause
     */
    pause: () => void;
    /**
     * 停止视频
     */
    stop: () => void;
    /**
     * 销毁视频实例
     *
     * 💡 在外部变量赋值 = new webrtcPlayer实例 在调用destroy后 将变量也置为null
     */
    destroy: () => void;
    /**
     * 更新video动画帧
     *
     * 💡 视频播放后 会回调options.onPlay
     */
    update: () => void;
    /**
     * 视频播放
     */
    play: () => void;
    /**
     * 解析传入的视频地址
     *
     * 💡 srs流媒体有单独的处理
     */
    parseUrl: (url: string) => Ret;
    /**
     * query参数填充
     * @param queryString  query字符串
     * @param obj 需要填充的对象 Ret
     */
    fillQuery: (queryString: string, obj: Ret) => void;
    /**
     * 配置参数错误事件
     *
     * 视频地址和视频dom为空时会抛出错误
     */
    optionsError: () => void;
}
