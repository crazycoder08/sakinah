import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, Nav, ToastController, ActionSheetController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { API_HOST, toastOptions } from '../../app/main';
import { showToast } from '../../app/app.component';
import { MenuPage } from '../menu/menu';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  userData: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    public dataService: DataServiceProvider,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl:LoadingController,
    public camera :Camera,
    public actionSheetCtrl: ActionSheetController,
    public nav: Nav) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprofilePage');
    this.loadUserProfile();
  }
  loadUserProfile() {
    let loader = this.loading.create({ spinner: "crescent" });
    loader.present();
    let apiUrl = API_HOST + "homescreenapi";
    this.dataService.postService(apiUrl, {}).subscribe(res => {
      loader.dismiss();
      this.userData = res.data.user;

    }, error => {
      console.error(error);
      loader.dismiss();
      showToast(this.toastCtrl, 'Something went wrong!');
    });
  }
  updateProfile(profileData) {
    let profileDetails = profileData.value;
    if (profileDetails.firstName === "") {
      toastOptions.message = "Please enter First Name";
      this.showToast();
    } else if (profileDetails.lastName === "") {
      toastOptions.message = "Please enter Last Name";
      this.showToast()
    } else if (profileDetails.contactno === "") {
      toastOptions.message = "Please enter Contact Number";
      this.showToast();
    } else {
   
      let loader = this.loadingCtrl.create({ spinner: "crescent" });
      loader.present();
      let apiUrl = API_HOST + "updateprofile";
      this.dataService.postService(apiUrl, profileDetails).subscribe(res => {
        if (res.code==200) {
          setTimeout(() => {
           
              this.navCtrl.setRoot(MenuPage);
              toastOptions.message = res.msg;
        
          }, 500);
        }
       
        this.showToast();
        loader.dismiss();
      }, error => {
        loader.dismiss();
        toastOptions.message = "something went wrong";
        this.showToast();
      });
    }
  }
  showToast() {
    let toast = this.toastCtrl.create(toastOptions);
    toast.present();
}
uploadImage() {
  let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Source",
      buttons: [
          {
              text: "Load from Library",
              icon: "images",
              handler: () => {
                  this.selectAction(0);
              }
          },
          {
              text: "Use Camera",
              icon: "camera",
              handler: () => {
                  this.selectAction(1);
              }
          }
      ]
  });
  actionSheet.present();
}

options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
  saveToPhotoAlbum: true,
  allowEdit: true,
  targetWidth: 200,
  targetHeight: 200
};
selectAction(actionType) {
  if (actionType === 0) {
      this.options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
  } else if (actionType === 1) {
      this.options.sourceType = this.camera.PictureSourceType.CAMERA;
  }
  this.camera.getPicture(this.options).then(imageData => {
      let apiUrl = API_HOST + "uploadprofilepicture";
      let param = { image: "data:image/jpeg;base64," + imageData };
      this.dataService.postService(apiUrl, param).subscribe(res => {
          if (res.status && !res.error) {
              //this.profile.userImgUrl = "data:image/jpeg;base64," + imageData;
              toastOptions.message = res.message;
              this.showToast();
          } else {
              toastOptions.message = res.message;
              this.showToast();
          }
      }, error => {
          toastOptions.message = "Error";
          this.showToast();
      }
      );
  }, err => { });
}
}
