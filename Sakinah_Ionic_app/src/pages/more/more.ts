import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events, PopoverController, Nav } from 'ionic-angular';
import { csConfig, recentlyPlayed, API_HOST } from '../../app/main';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { SmControlProvider } from '../../providers/sm-control/sm-control';
import { showToast, playTrack } from '../../app/app.component';
import { MusicPlayerPage } from '../music-player/music-player';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {
  myMusic: any = [];
  config: any = csConfig;
  paramsData: any = {};
  isLoaded: boolean = false;
  isFormLikesPage: boolean;
  loaded: boolean = true;
  moodId:any;
  moodList:any=[];
  moodImage:any;
  playlistsFeeds:any=[];
  moodname:any=[];
  selectedSegment:any;
  constructor(  public navParams: NavParams,
    public navctrl:NavController,
    public dataService: DataServiceProvider,
    public toastCtrl: ToastController,
    public loading: LoadingController,
    public smplayer: SmControlProvider,
    public events: Events,
    public nav: Nav,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController) {
    this.moodId=this.navParams.get('moodId');
    this.selectedSegment=this.moodId;
    this.moodImage=this.navParams.get('moodImage');
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }
  ionViewDidEnter() {
    this.playlistsFeeds = [];
    this.loadPlaylistFeeds(null, null);
    this.moodlist();
  }
  call: boolean = true;
  loadPlaylistFeeds(ev, refresh) {
    if (this.call) {
      let loader = this.loadingCtrl.create({ spinner: "crescent" });
      loader.present();
      let apiUrl = API_HOST + "listsongbymood";
      let data = {
        moodId: this.moodId
      };
      this.dataService.postService(apiUrl, data).subscribe(res => {
        if (res.code == 200) {
          if (refresh) { this.playlistsFeeds = []; }
          if (res.data.length > 0) {
            this.playlistsFeeds = res.data;
          } else {
            this.call = false;
          }
          if (ev) { ev.complete(); }
        } else {
          showToast(this.toastCtrl, res.message);
        }
        loader.dismiss();
        this.loaded = (this.playlistsFeeds.length > 0);
      }, error => {
        console.error(error);
        loader.dismiss();
        showToast(this.toastCtrl, 'Something went wrong!');
      });
    } else {
      if (ev) {
        ev.complete();
      }
    }
  }
  loadMore(ev, refresh) {
    setTimeout(() => {
      if (refresh) { this.call = true; }
      this.loadPlaylistFeeds(ev, refresh);
    }, 1000);
  }
  playsong: boolean = false;
  playSelectedSong(ev, song) {
    this.playsong === true;
    console.log(this.playsong);
    ev.stopPropagation();
    if (!csConfig.isPlaying)
      recentlyPlayed.queue = this.playlistsFeeds;
    playTrack(song, this.smplayer, this.events);
    this.nav.push(MusicPlayerPage,  this.playlistsFeeds);
  }


  moodlist() {
    let loader = this.loading.create({ spinner: "crescent" });
    loader.present();
    let apiUrl = API_HOST + "homescreenapi";
    this.dataService.postService(apiUrl, {}).subscribe(res => {
      loader.dismiss();
      this.moodList = res.data.moods;
      let moodname;
      for (moodname of this.moodList) {
        this.moodId = moodname._id;
        this.moodname = moodname.moodName;
        console.log(moodname._id);
      }

    }, error => {
      console.error(error);
      loader.dismiss();
      showToast(this.toastCtrl, 'Something went wrong!');
    });



  }
  segmentChanged(value) {
    if (value) {
      console.log("happy",value);
      this.playlistsFeeds = [];
      // this.loadPlaylistFeeds(null, null,value);
       
    } 
}
selectedItem(moodId,index){
    console.log("moodniid",moodId);
    if(index>3){
      console.log("here");
      
      this.selectedSegment="more";
    }
    this.navctrl.push(HomePage,{moodId:moodId})
    //this.loadPlaylistFeeds(null, null,moodId);
  }


}
