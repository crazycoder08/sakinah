import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AccountsettingsPage } from '../accountsettings/accountsettings';
import { MembershipplanPage } from '../membershipplan/membershipplan';
import { EditprofilePage } from '../editprofile/editprofile';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { API_HOST } from '../../app/main';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { showToast, resetConfig } from '../../app/app.component';
import { LoginPage } from '../login/login';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  menus: any = [];
  userData: any = {};
  isVerify: any = {};
  firstName: any = {};
  lastName: any = {};
  mobile: any = {};
  email: any = {};
  subscriptionPlan: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public localStorageProvider: LocalStorageProvider,
    public dataService: DataServiceProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.getHomedata();
    this.loadSideNav();
  }


  loadSideNav() {

    this.menus = [
      { id: 1, name: 'Home', class: "ios-home-outline", page: HomePage },
      { id: 2, name: 'Profile', class: "ios-person-outline", page: EditprofilePage },
      { id: 3, name: 'Membership Plan', class: "ios-cash-outline", page: MembershipplanPage },
      { id: 4, name: 'Account Settings', class: "ios-settings-outline", page: AccountsettingsPage },

    ];

    this.nav.setRoot(HomePage);


  }

  showLoader() {
    let loader = this.loadingCtrl.create({ spinner: "crescent" });
    loader.present();
    setTimeout(() => {
      loader.dismiss();
    }, 50);
  }



  goToPage(page) {

    this.nav.setRoot(page.page);
  }


  getHomedata() {
    let loader = this.loadingCtrl.create({ spinner: "crescent" });
    loader.present();
    let apiUrl = API_HOST + "homescreenapi";
    this.dataService.postService(apiUrl, {}).subscribe(res => {
      loader.dismiss();
      this.userData = res.data.user;
      this.isVerify = res.data.user.isVerified;
      this.firstName = res.data.user.firstName;
      this.lastName = res.data.user.lastName;
      this.mobile = res.data.user.mobile;
      this.email = res.data.user.email;
      this.subscriptionPlan = res.data.subscriptionPlan;


    }, error => {
      console.error(error);
      loader.dismiss();
      showToast(this.toastCtrl, 'Something went wrong!');
    });
  }
  goToUserProfile(userId) {
    this.nav.push(EditprofilePage, { songUserId: userId });
  }

  logoutClick() {
    let alert = this.alertCtrl.create({
      title: 'LogOut',
      message: 'Are You sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            let loader = this.loadingCtrl.create({ spinner: "crescent" });
            loader.present();
            resetConfig();
            this.localStorageProvider.setIsLoggedIn(false);
            this.localStorageProvider.clearStorage();
            loader.dismiss();
            this.nav.setRoot(LoginPage);
          }
        }
      ]
    });
    alert.present();

  }

}
