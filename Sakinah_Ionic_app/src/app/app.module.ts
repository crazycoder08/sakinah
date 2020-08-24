import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { HttpModule } from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import { MenuPage } from '../pages/menu/menu';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { AccountsettingsPage } from '../pages/accountsettings/accountsettings';
import { MembershipplanPage } from '../pages/membershipplan/membershipplan';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { Camera } from '@ionic-native/camera';
import { SmControlProvider } from '../providers/sm-control/sm-control';
import { MorePage } from '../pages/more/more';
import { MusicPlayerPage } from '../pages/music-player/music-player';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';
import { MusicControls } from '@ionic-native/music-controls';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    EditprofilePage,
    AccountsettingsPage,
    MembershipplanPage,
    ForgotPasswordPage,
    MorePage,
    MusicPlayerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    //IonicStorageModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    EditprofilePage,
    AccountsettingsPage,
    MembershipplanPage,
    ForgotPasswordPage,
    MorePage,
    MusicPlayerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    MusicControls,
    LocalNotifications,
    FileOpener,  
    AndroidPermissions,
    UniqueDeviceID,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataServiceProvider,
    LocalStorageProvider,
    SmControlProvider
    
  ]
})
export class AppModule { }
