import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Nav } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { SmControlProvider } from '../../providers/sm-control/sm-control';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { showToast } from '../../app/app.component';
import { API_HOST } from '../../app/main';

/**
 * Generated class for the AccountsettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accountsettings',
  templateUrl: 'accountsettings.html',
})
export class AccountsettingsPage {
  paypalForm: FormGroup;
  changePasswordForm: FormGroup;
  paypalEmail: string;
  oldPass: string;
  newPass: string;
  confirmPass: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataServiceProvider,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public nav: Nav,
    public localStorageProvider: LocalStorageProvider,
    public alertCtrl: AlertController,
    public smControl: SmControlProvider) {

    this.paypalForm = this.formBuilder.group({
      paypalEmail: ['', Validators.compose([Validators.required, Validators.pattern('[^@]+@[^@]+\.[a-zA-Z]{2,6}'), Validators.maxLength(100)])],
      stripeEmail: ['', Validators.compose([Validators.required, Validators.pattern('[^@]+@[^@]+\.[a-zA-Z]{2,6}'), Validators.maxLength(100)])]
    });
    this.changePasswordForm = this.formBuilder.group({
      oldPass: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      newPass: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPass: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, { validator: this.matchingPasswords('newPass', 'confirmPass') });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountsettingsPage');
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  changePassword(formData) {

    let validateObj = this.validateOtp(formData);
    if (!validateObj.isValid) {
      showToast(this.toastCtrl, validateObj.message);
      return false;
    }
    else {
      let loader = this.loading.create({ spinner: "crescent" });
      loader.present();
      let apiUrl = API_HOST + "updatepassword";
      let data = {
        newPassword: formData.newPass,
        currentPassword: formData.oldPass
      };
      this.dataService.postService(apiUrl, data).subscribe(res => {
        if (res.code == 200) {
          this.newPass = '';
          this.confirmPass = '';
          this.oldPass = '';
          this.nav.pop();
        }
        loader.dismiss();
        showToast(this.toastCtrl, res.msg);
      }, error => {
        console.error(error);
        loader.dismiss();
        showToast(this.toastCtrl, 'Something went wrong!');
      });

    }
  }

  validateOtp(data) {
    if (data.oldPass && data.newPass) {
      return {
        isValid: true,
        message: ''
      };
    } else {
      return {
        isValid: false,
        message: 'please enter the all required fields!'
      }
    }
  }

  //CheckPassword Valid or not
  checkPasswordValid() { }

  //Check Password match or not
  checkPasswordMatchOrNot() { }

}
