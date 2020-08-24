import { Component } from '@angular/core';
import { NavController, NavParams, Events, Nav, PopoverController, LoadingController, ToastController } from 'ionic-angular';
import { PlayerMoreComponent } from '../../components/player-more/player-more';
import { SmControlProvider } from '../../providers/sm-control/sm-control';
import { formatDuration, soundManager, csConfig, API_HOST, headerOptions } from '../../app/main';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { showToast } from '../../app/app.component';
declare var moment;
@Component({
    selector: 'page-music-player',
    templateUrl: 'music-player.html',
})
export class MusicPlayerPage {
    params: any = csConfig;
    totalTime: any;
    earlyPosition: any;
    currentTime: any;
    extraDetails: any = {};
    interval: number = null;
    mediaStatus: number;
    constructor(
        private nav: Nav,
        public navCtrl: NavController,
        public navParams: NavParams,
        private events: Events,
        public popoverCtrl: PopoverController,
        private smplayer: SmControlProvider,
        public loading: LoadingController,
        public toastCtrl: ToastController,
        public dataService: DataServiceProvider,
        public localStorageProvider: LocalStorageProvider) {
        this.getSongDetails();
        this.updateConfig();
        this.getParams();
    }

    ionViewDidEnter() {
        let data = this.navParams.data;
       // this.loadSongDetails(data.songData);
    }

    loadSongDetails(songData) {
        let apiUrl = API_HOST + "loadTrackData-sd.php";
        let data = {
            moodId: songData._id
        };
        this.dataService.postService(apiUrl, data).subscribe(res => {
            if (res.status && !res.error) {
                this.extraDetails = res;
            }
        }, error => {
            console.error(error);
            showToast(this.toastCtrl, 'Something went wrong!');
        });
    }

    getSongDetails() {
        this.events.subscribe('playEvent', (songData) => {
            if (songData) {
                this.params.songDetail = songData;
               // this.loadSongDetails(this.params.songDetail);
            }
        });
    }
    updateConfig() {
        this.events.subscribe('track', (track) => {
            if (track) {
                this.params.nowPlaying = track.nowPlaying;
                this.params.position = track.position;
                this.params.duration = track.duration;
                this.params.isBuffering = track.isBuffering;
                this.params.isPlaying = track.isPlaying;
                this.params.isPaused = track.isPaused;
                this.syncProgress();
            }
        });
    }
    getParams() {
        if (!this.params.songDetail) {
            let songData = this.navParams.get('songData');
            if (songData) { this.params.songDetail = songData; }
        }
        this.syncProgress();
    }
    syncProgress() {
        let duration = this.params.duration / 1000;
        let position = this.params.position / 1000;
        let durationFormat = ((duration < 60 && duration > 3600) ? formatDuration.hour : formatDuration.minute);
        if (duration !== -1) {
            this.totalTime = moment.duration(duration, "seconds").format(durationFormat, { trim: false });
        } else {
            this.totalTime = moment.duration(0, "seconds").format(durationFormat, { trim: false });
        }
        this.currentTime = moment.duration(position, "seconds").format(durationFormat, { trim: false });
        this.earlyPosition = this.params.position;
        if (this.params.position == this.params.duration) {
         this.currentTime = moment.duration(0, "seconds").format(durationFormat, { trim: false });
        }
    }


    seekTo(event) {
        if (this.params.isPaused) {
            this.togglePause();
        }
        soundManager.setPosition(this.params.nowPlaying, event.value);
    }

    resetConfig() {
        this.params.position = 0;
        this.params.duration = 0;
        this.earlyPosition = 0;
    }

    togglePause() {
        this.smplayer.togglePause();
        setTimeout(() => {
            this.updateConfig();
        }, 10);
    }

    nextClick() {
        this.resetConfig();
        this.smplayer.nextTrack();
    }

    previousClick() {
        this.resetConfig();
        this.smplayer.prevTrack();
    }

    backClick() {
        this.nav.pop();
    }

    viewUserPublicProfile(songDetail) {
        //this.nav.push(PublicProfilePage, { songUserId: songDetail.songUserId });
    }

    viewTrackDetail(songDetail) {
        //this.nav.push(TrackDetailPage, { trackId: songDetail.id });
    }


    // ---------------------POP OVER FUNCTIONS--------------------------

    presentPopover(myEvent) {
        let isLoggedInUser = (headerOptions['Content-Id'] == this.params.songDetail.songUserId);
        let listObj = {
            loggedInUserId: headerOptions['Content-Id'],
            songUserId: this.params.songDetail.songUserId,
            songId: this.params.songDetail.id,
            currentTrackTime: this.currentTime,
            listData: []
        };
        listObj.listData = [
            {
                action: 'addToPlaylist',
                name: 'Add to playlist',
                iconName: 'ios-list',
                show: true
            }, {
                action: 'addToAlbums',
                name: 'Add to album',
                iconName: 'ios-albums-outline',
                show: isLoggedInUser
            }, {
                action: 'comment',
                name: 'Comment',
                iconName: 'ios-chatbubbles-outline',
                show: true
            }, {
                action: 'share',
                name: 'Share',
                iconName: 'md-share',
                show: true
            }, {
                action: 'editTrack',
                name: 'Edit Track',
                iconName: 'ios-create-outline',
                show: isLoggedInUser
            }
        ]
        let popover = this.popoverCtrl.create(
            PlayerMoreComponent,
            { listObj },
            { cssClass: 'music-player-opt', showBackdrop: true, enableBackdropDismiss: true }
        );
        // popover.onDidDismiss(value => {

        // });
        popover.present({
            ev: myEvent
        });
    }
}
