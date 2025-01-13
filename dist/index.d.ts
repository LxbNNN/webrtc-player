import { Options, Ret, WebrtcPlayer } from './types';
declare class webrtcPlayer implements WebrtcPlayer {
    webrtc: null | RTCPeerConnection;
    options: Options;
    urlParams: Ret;
    paused: boolean;
    animationId: number | null;
    isPlaying: boolean;
    constructor(options: Options);
    videoElementInit(): void;
    player(): void;
    sdpRequest(offer: RTCSessionDescriptionInit): Promise<string>;
    webRTCConnection(): Promise<void>;
    pause(): void;
    stop(): void;
    destroy(): void;
    update(): void;
    play(): void;
    parseUrl(url: string): Ret;
    fillQuery(queryString: string, obj: Ret): void;
    optionsError(): void;
}
export default webrtcPlayer;
