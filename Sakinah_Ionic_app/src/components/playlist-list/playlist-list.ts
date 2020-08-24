import { Component, ViewChild } from '@angular/core';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { API_HOST, } from "../../app/main";
import { NavController, NavParams, Nav, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { showToast } from '../../app/app.component';

@Component({
    selector: 'playlist-list',
    templateUrl: 'playlist-list.html'
})
export class PlaylistListComponent {
    songId: number;
    isPlaylist: boolean;
    playlists: any = [];
    albums: any = [];
    @ViewChild(Nav) nav: Nav;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public dataService: DataServiceProvider,
        public loading: LoadingController,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController) {
        this.isPlaylist = this.navParams.get('isPlaylist');
        this.songId = this.navParams.get('songId');
        this.loadPlaylist();
    }

    loadPlaylist() {
        let loader = this.loading.create({ spinner: "crescent" });
        loader.present();
        let apiUrl = API_HOST + "addAlbumPlaylist-sd.php";
        let data = {
            action: ((this.isPlaylist) ? 'getPlaylists' : 'getAlbums'),
            trackId: this.songId
        };
        this.dataService.postService(apiUrl, data).subscribe(res => {
            if (res.status && !res.error) {
                ((this.isPlaylist) ? (this.playlists = res.playlistList) : (this.albums = res.albumList));
                loader.dismiss();
            }
        }, error => {
            console.error(error);
            loader.dismiss();
            showToast(this.toastCtrl, 'Something went wrong!');
        });
    }

    addToPlayList(item) {
        if (item.isAdded && this.isPlaylist) {
            showToast(this.toastCtrl, 'Already added in this playlist.');
            return;
        } else if (item.isAdded && !this.isPlaylist) {
            showToast(this.toastCtrl, 'Already added in this album.');
            return;
        } else {
            let loader = this.loading.create({ spinner: "crescent" });
            loader.present();
            let apiUrl = API_HOST + "addAlbumPlaylist-sd.php";
            let data = {
                action: ((this.isPlaylist) ? 'addToPlaylist' : 'addToAlbum'),
                trackId: this.songId,
                typeId: ((this.isPlaylist) ? item.playlistId : item.albumId)
            };
            this.dataService.postService(apiUrl, data).subscribe(res => {
                if (res.status && !res.error) {
                    loader.dismiss();
                    this.viewCtrl.dismiss();
                } else {
                    loader.dismiss();
                    showToast(this.toastCtrl, res.message);
                }
            }, error => {
                console.error(error);
                loader.dismiss();
                showToast(this.toastCtrl, 'Something went wrong!');
            });
        }
    }

    backClick() {
        this.viewCtrl.dismiss();
    }
}
