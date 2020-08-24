import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { API_HOST } from '../../app/main';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { PlaylistListComponent } from "../playlist-list/playlist-list";
import { showToast } from '../../app/app.component';

@Component({
    selector: 'player-more',
    templateUrl: 'player-more.html'
})
export class PlayerMoreComponent {
    listObj: any = {};
    constructor(public navParams: NavParams,
        public viewCtrl: ViewController,
        public dataService: DataServiceProvider,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public loading: LoadingController,
        public toastCtrl: ToastController) {
        this.listObj = this.navParams.data.listObj;
    }

    itemSelected(item) {
        if (item.action == 'addToPlaylist') {
            this.getPlaylist();
        } else if (item.action == 'addToAlbums') {
            this.getAlbums();
        } else if (item.action == 'comment') {
            this.addComment();
        } else if (item.action == 'share') {

        } else if (item.action == 'editTrack') {

        }
    }

    getPlaylist() {
        this.viewCtrl.dismiss();
        let playListModel = this.modalCtrl.create(
            PlaylistListComponent,
            { songId: this.listObj.songId, isPlaylist: true },
            { cssClass: 'playlist-model', showBackdrop: true, enableBackdropDismiss: true });
        playListModel.present();
    }

    getAlbums() {
        this.viewCtrl.dismiss();
        let albumModel = this.modalCtrl.create(
            PlaylistListComponent,
            { songId: this.listObj.songId, isPlaylist: false },
            { cssClass: 'playlist-model', showBackdrop: true, enableBackdropDismiss: true });
        albumModel.present();
    }

    addComment() {
        this.viewCtrl.dismiss();
        let alert = this.alertCtrl.create({
            title: 'Comment at ' + this.listObj.currentTrackTime,
            inputs: [
                {
                    name: 'comment',
                    type: 'text',
                    placeholder: 'Enter comment'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        //Cancel
                    }
                },
                {
                    text: 'Send',
                    handler: data => {
                        if (data.comment !== "" && data.comment !== undefined) {
                            let loader = this.loading.create({ spinner: "crescent" });
                            loader.present();
                            let apiUrl = API_HOST + "getReplies-sd.php";
                            let paramData = {
                                trackId: this.listObj.songId,
                                duration: this.listObj.currentTrackTime,
                                action: 'sendReply',
                                replyMessage: data.comment,
                                commentId: 0
                            };
                            this.dataService.postService(apiUrl, paramData).subscribe(res => {
                                if (res.status && !res.error) {
                                    showToast(this.toastCtrl, res.message);
                                    return true;
                                } else {
                                    return false;
                                }
                            }, error => {
                                console.error(error);
                                showToast(this.toastCtrl, 'Something went wrong!');
                            });
                            loader.dismiss();
                        } else {
                            showToast(this.toastCtrl, 'Please enter comment.');
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    dismiss(item) {
        this.viewCtrl.dismiss(item);
    }

}
