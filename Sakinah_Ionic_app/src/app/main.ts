import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import * as soundmanager2 from '../assets/js/soundmanager2.js';
import * as animation from '../assets/js/anime.min.js'
import * as momentjs from '../assets/js/moment.js';
//export const API_HOST = "http://192.168.5.6/soundeed/app-sd/webservice-sd/";
export const API_HOST = "http://35.225.89.191/user/";
export const toastOptions = { message: "", duration: 4000, showCloseButton: true, closeButtonText: "X" };
export const soundManager = soundmanager2.soundManager;
export const anime = animation;
export const moment = momentjs;
export const formatDuration = {
    minute: "mm:ss",
    hour: "hh:mm:ss"
};
export const hasNotifications = {
    hasGeneralnotifications: false,
    hasChatnotifications: false
};
export const csConfig = {
    isShowFooterPlayer: false,
    nowPlaying: 0,
    position: 0,
    duration: 0,
    currentTime: 0,
    isBuffering: true,
    isPlaying: false,
    isPaused: false,
    soundObj: null
};
let queue: any = [];
export const recentlyPlayed: any = { queue: queue, songId: 0 };
export const headerOptions: any = { 'Content-Type': 'application/json', 'Authorization': null };
export const counterInApp: any = {
    counterInterval: 0,
    counters: { notifications: { dispCounter: 0 }, messages: { dispCounter: 0 }, paymentGatewayStatus: false }
};
export const appName = "Sakinah";
platformBrowserDynamic().bootstrapModule(AppModule);