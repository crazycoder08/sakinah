import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, App, Nav,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { toastOptions, headerOptions, csConfig, recentlyPlayed, counterInApp } from './main';
import { LoginPage } from '../pages/login/login';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { MenuPage } from '../pages/menu/menu';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  showSplash: boolean = true;
  @ViewChild(Nav) nav: Nav;
  constructor(statusBar: StatusBar,
    splashScreen: SplashScreen,
    public localStorageProvider: LocalStorageProvider,
    public menuCtrl: MenuController,
    public platform: Platform,
    public alertCtrl:AlertController,
    public app: App) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
      this.initializeApp();
    });
  }

  initializeApp() {
    this.localStorageProvider.getIsLoggedIn().then(res => {
      if (res) {
        this.localStorageProvider.getAccessToken().then(accessToken => {
          this.localStorageProvider.getUserID().then(userId => {
            headerOptions['Content-Type'] = 'application/json';
            headerOptions['Authorization'] = accessToken;
            //headerOptions['Content-Id'] = userId;
           this.hideSplashScreen(MenuPage);
          //  this.hideSplashScreen(LoginPage);
          });
        });
      } else {
        this.hideSplashScreen(LoginPage);
      }
     

       this.platform.registerBackButtonAction(() => {
         if (this.menuCtrl.isOpen()) {
          this.menuCtrl.close();
          return;
        }
        let overlay = this.app._appRoot._loadingPortal.getActive() ||
          this.app._appRoot._toastPortal.getActive() ||
          this.app._appRoot._overlayPortal.getActive() ||
          this.app._appRoot._modalPortal.getActive();
        let nav = this.app.getActiveNav();
        if (overlay && overlay.dismiss) {
          overlay.dismiss();
        } else if (nav.canGoBack()) {
          nav.pop();
        } else {
          //Minimize app
        } 
        
      }, 100); 
    });
  }

  hideSplashScreen(page) {
    setTimeout(() => {
      // this.splashScreen.hide();
      this.showSplash = false;
      this.rootPage = page;
    }, 750);
  }

logout() {
  this.nav.setRoot('LoginPage');
}

}


export function playTrack(song, smplayer, events) {
 console.log(song,events);
  song.isPlaying = (song._id == csConfig.nowPlaying);
  if (song.isPlaying) {
      smplayer.togglePause();
      console.log(" song.if ", song.isPlaying );
  } else {
      let exist = recentlyPlayed.queue.filter(item => (item.id == song._id));
      console.log(" exist ", exist );
      let index = recentlyPlayed.queue.indexOf(exist[0]);
      for (let i = 0; i < recentlyPlayed.queue.length; i++) {
          recentlyPlayed.queue[i].isPlaying = false;
      }
      song.isPlaying = true;
      if (index !== -1) {
          recentlyPlayed.queue[index].isPlaying = true;
      } else {
        //  recentlyPlayed.queue.push(song);
      }
      recentlyPlayed.songId = song._id;
      events.publish('playEvent', song);
      console.log( recentlyPlayed.songId = song._id);
  }
  console.log("recent",recentlyPlayed);
}
export function showToast(toastCtrl, message) {
  toastOptions.message = message;
  let toast = toastCtrl.create(toastOptions);
  toast.present();
}

export function resetConfig() {
  // user config
  headerOptions['token'] = null;
  headerOptions['Content-Id'] = null;
  // song config
  csConfig.isShowFooterPlayer = false;
  csConfig.nowPlaying = 0;
  csConfig.position = 0;
  csConfig.duration = 0;
  csConfig.currentTime = 0;
  csConfig.isBuffering = false;
  csConfig.isPlaying = false;
  csConfig.isPaused = false;
  csConfig.soundObj = null;
  // queue config
  if (counterInApp.counterInterval) {
      clearInterval(counterInApp.counterInterval);
  }
  recentlyPlayed.queue = [];
}




