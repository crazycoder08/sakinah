import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Events, NavParams, Platform, MenuController, App } from 'ionic-angular';
import { API_HOST, csConfig, recentlyPlayed } from '../../app/main';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { MorePage } from '../more/more';
import { showToast, playTrack } from '../../app/app.component';
import { SmControlProvider } from '../../providers/sm-control/sm-control';
import { MusicPlayerPage } from '../music-player/music-player';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tab4Root: any = MorePage;
  moodList: any = [];
  moodname: any = [];
song:any=[];
  
  moodId: any;
  playlistsFeeds: any = [];
  loaded: boolean = true;
  isLoaded: boolean = false;
  config: any = csConfig;
  paramsData: any = {};
  tab1: any = HomePage;
  mySelectedIndex: number;
  moodIdBack:any;
  selectedSegment = '';
  constructor(public navCtrl: NavController,
    public loading: LoadingController,
    public navParams:NavParams,
    public dataService: DataServiceProvider,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public app: App,
    public smplayer: SmControlProvider,
    private localNotifications: LocalNotifications,
    private fileOpener: FileOpener,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    public events: Events,
  ) {
    this.events.subscribe('playEvent', (songData) => {
      if (songData) {
          console.log("songdata",songData);
          this.config.songDetail = songData;
          smplayer.initSMPlayer(songData);
      }
  });

  this.events.subscribe('nextSong', (isPrev) => {
    let exists = recentlyPlayed.queue.findIndex(item => item._id == csConfig.nowPlaying);
    if (isPrev && exists !== -1) {
        let songIndex = (exists - 1 !== -1) ? (exists - 1) : (recentlyPlayed.queue.length - 1);
        this.playSelectedSong(recentlyPlayed.queue[songIndex]);
    } else if (exists + 1 < recentlyPlayed.queue.length) {
        this.playSelectedSong(recentlyPlayed.queue[exists + 1]);
    } else {
        this.playSelectedSong(recentlyPlayed.queue[0]);
    }
});

   // this.initPushNotification();
    this.moodlist(null, null);  
    if(this.moodIdBack){
      this.moodIdBack=this.navParams.get('moodId');
      this.selectedSegment=this.moodIdBack; 
    }
    else{
      this.selectedSegment="more";
    }


    
  }


  initPushNotification(){
    this.localNotifications.on("click").subscribe((notification) => {
      this.androidPermissions.requestPermissions([
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.READ_PHONE_STATE,
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]).then(res => {
          if (notification && notification.data) {
              let data = notification.data;
              if (data && data.type && data.type == 'trackDownload') {
                  this.fileOpener.open(data.filePath, 'audio/mpeg').then(res => {
                      //success
                  }).catch(e => {
                      
                  });
              }
          }
      }).catch(error => {
          console.error(error);
          alert('Permission Error: ' + JSON.stringify(error));
      })

  });

  }

  moodlist(ev, refresh) {
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
       if(moodname._id){
           this.playlistsFeeds = [];
           this.loadPlaylistFeeds(null, null,moodname._id);
         } 
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
     
      
      this.selectedSegment="more";
    }
    this.loadPlaylistFeeds(null, null,moodId);
  }

  songlist(moodId, moodImage) {
    this.moodId = moodId;
    this.navCtrl.push(MorePage,{moodId:moodId,moodImage:moodImage});

  }

  call: boolean = true;
  loadPlaylistFeeds(ev, refresh,moodId) {

    console.log("loadPlaylistFeeds",moodId);
    
    if (this.call) {
      let loader = this.loading.create({ spinner: "crescent" });
      loader.present();
      let apiUrl = API_HOST + "listsongbymood";
      let data = {
        moodId: moodId
      };
      this.dataService.postService(apiUrl, data).subscribe(res => {
        if (res.code == 200) {
          if (refresh) { this.playlistsFeeds = []; }
         
            this.playlistsFeeds = res.data;
            this.isLoaded = true;
         
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
      this.loadPlaylistFeeds(ev, refresh,this.moodId);
    }, 1000);
  }
  playsong: boolean = false;
  playSelectedSong(song) {
    this.playsong === true;
    console.log(this.playsong);
    //ev.stopPropagation();
    if (!csConfig.isPlaying)
      recentlyPlayed.queue = this.playlistsFeeds;
    playTrack(song, this.smplayer, this.events);
    this.navCtrl.push(MusicPlayerPage,  this.playlistsFeeds);
  }
  

// openMusicPlayer(event,song) {
//   this.song=song;
//   let params = {
//       songData:this.song,
//       config: {
//           nowPlaying: this.config.nowPlaying,
//           position: this.config.position,
//           duration: this.config.duration,
//           isBuffering: this.config.isBuffering,
//           isPlaying: true,
//           isPaused: this.config.isPaused
//       }
//   };
//   this.navCtrl.push(MusicPlayerPage, params);
// }

}
