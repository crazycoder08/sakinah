import { Injectable } from '@angular/core';
import { Events, Platform, ToastController } from 'ionic-angular';
import { soundManager, csConfig } from '../../app/main';
import { MusicControls } from '@ionic-native/music-controls';
// import { updateHistory, showToast } from '../../app/app.component';
import { showToast } from '../../app/app.component';
import { DataServiceProvider } from '../data-service/data-service';

var soundObj: any;
@Injectable()
export class SmControlProvider {
    constructor(private events: Events, private musicControls: MusicControls, public platform: Platform, private dataService: DataServiceProvider, private toastCtrl: ToastController) {
    }
    initSMPlayer(songData) {
        console.log("songData",songData);
        if (soundObj) {
            console.log("soundObj",soundObj);
            soundObj.destruct();
        }
        csConfig.position = 0;
        csConfig.duration = 0;
        csConfig.isBuffering = true;
        csConfig.nowPlaying = songData._id;
        let self = this;
        soundManager.setup({
            debugMode: false,
            onready: function () {
                if (soundManager.canPlayURL(songData.songUrl)) {
                   // console.log("soundManager",songData.songUrl);
                    if (self.platform.is('cordova')) {
                        self.setupMusicControl(songData);
                    }
                    soundObj = soundManager.createSound({
                        id: songData._id,
                        url: songData.songUrl,
                        stream: true,
                        autoLoad: true,
                        autoPlay: true,
                        whileplaying: function () {
                            console.log("soundObj",soundObj);
                            
                            csConfig.position = this.position;
                            csConfig.duration = this.duration;
                            csConfig.isShowFooterPlayer = true;
                            csConfig.isPlaying = true;
                            csConfig.isPaused = false;
                            self.publishTrackConfig();
                        },
                        onload: function () {
                            csConfig.isBuffering = false;
                            csConfig.isPlaying = true;
                            csConfig.isPaused = false;
                            csConfig.duration = this.duration;
                            // if (self.platform.is('cordova')) {
                            //     self.setupMusicControl(songData);
                            // }
                        },
                        onplay: function () {
                            csConfig.isPlaying = true;
                            csConfig.isPaused = false;
                            self.publishTrackConfig();
                        },
                        onpause: function () {
                            csConfig.isPlaying = false;
                            csConfig.isPaused = true;
                            self.publishTrackConfig();
                        },
                        onresume: function () {
                            csConfig.isPlaying = true;
                            csConfig.isPaused = false;
                            self.publishTrackConfig();
                        },
                        onfinish: function () {
                            csConfig.isBuffering = true;
                            csConfig.isPlaying = false;
                            csConfig.isPaused = false;
                            self.nextTrack();
                        },
                        onerror: function (code, description) {
                            console.log(this.id + ' failed?', code, description, this.loaded);
                            csConfig.isBuffering = false;
                            csConfig.isPlaying = false;
                            csConfig.isPaused = false;
                            if (this.loaded) {
                                // HTML5 case: network error, or client aborted download etc.?
                                this.stop(); // Reset sound state, to be safe
                                // Show play / retry button to user in UI?
                                csConfig.isShowFooterPlayer = true;
                            } else {
                                csConfig.isShowFooterPlayer = false;
                                if (code == 1) { // MEDIA_ERR_ABORTED
                                    showToast(self.toastCtrl, "The user canceled the audio.");
                                } else if (code == 2) { // MEDIA_ERR_NETWORK
                                    showToast(self.toastCtrl, "A network error occurred while fetching the audio.");
                                } else if (code == 3) { // MEDIA_ERR_DECODE
                                    showToast(self.toastCtrl, "An error occurred while decoding the audio.");
                                } else if (code == 4) { // MEDIA_ERR_SRC_NOT_SUPPORTED
                                    showToast(self.toastCtrl, "The audio is missing or is in a format not supported by your browser.");
                                } else {
                                    showToast(self.toastCtrl, "An unknown error occurred.");
                                }
                            }
                        }
                    });
                    csConfig.soundObj = soundObj;
                    if (soundObj != undefined) {
                        //updateHistory(csConfig.nowPlaying, "t", self.dataService);
                    }
                } else {
                    console.log("Can't play your song..!! ");
                }
            },
            ontimeout: function () {
                console.log("Can't play your song..!! ");
            }
        });
    }

    togglePause() {
        csConfig.isPaused = !csConfig.isPaused;
        csConfig.isPlaying = !csConfig.isPlaying;
        soundObj.togglePause();
        if (this.platform.is('cordova')) {
            this.musicControls.listen();
            this.musicControls.updateIsPlaying(csConfig.isPlaying);
        }
        this.publishTrackConfig();
    }

    nextTrack() {
        setTimeout(() => {
            this.events.publish('nextSong', false);
        }, 100);
    }

    prevTrack() {
        setTimeout(() => {
            this.events.publish('nextSong', true);
        }, 100);
    }

    publishTrackConfig() {
        this.events.publish('track', csConfig);
    }

    setupMusicControl(songData) {
        this.musicControls.create({
            track: songData.title,
            //artist: songData.userName,
           // cover: songData.trackImage,
            isPlaying: csConfig.isPlaying,
            dismissable: false,
            hasPrev: true,
            hasNext: true,
            hasClose: true,
            hasSkipForward: false,
            hasSkipBackward: false,
            skipForwardInterval: 15,
            skipBackwardInterval: 15,
            album: songData.title,
            duration: csConfig.duration,
            elapsed: csConfig.position,
            ticker: 'Now playing ' + songData.title
        });
        this.musicControls.subscribe().subscribe((action) => {
            const message = JSON.parse(action).message;
            switch (message) {
                case 'music-controls-next':
                    this.events.publish('nextSong', false);
                    break;
                case 'music-controls-previous':
                    this.events.publish('nextSong', true);
                    break;
                case 'music-controls-pause':
                    this.togglePause();
                    break;
                case 'music-controls-play':
                    this.togglePause();
                    break;
                case 'music-controls-destroy':
                    soundObj.destruct();
                    this.musicControls.destroy();
                    this.publishTrackConfig();
                    break;
                case 'music-controls-toggle-play-pause':
                    this.togglePause();
                    break;
                case 'music-controls-seek-to':
                    break;
                case 'music-controls-skip-forward':
                    break;
                case 'music-controls-skip-backward':
                    break;
                case 'music-controls-media-button':
                    break;
                case 'music-controls-headset-unplugged':
                    break;
                case 'music-controls-headset-plugged':
                    break;
                default:
                    break;
            }
        });
        this.musicControls.listen();
        this.musicControls.updateIsPlaying(true);
    }

    destroySound() {
        if (csConfig.soundObj !== null) {
            csConfig.soundObj.destruct();
        }
    }
}
