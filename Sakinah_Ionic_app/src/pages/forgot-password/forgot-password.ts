import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { API_HOST } from '../../app/main';
import { showToast } from '../../app/app.component';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  hide = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loading: LoadingController,
    public dataService: DataServiceProvider,
    public toastCtrl: ToastController,
    public alertCtrl:AlertController) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('[^@]+@[^@]+\.[a-zA-Z]{2,6}'), Validators.maxLength(100)])],
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  onSubmit(value: any): void {
       
    if (this.forgotPasswordForm.valid) {
        let loader = this.loading.create({ spinner: "crescent" });
        loader.present();
        let apiUrl = API_HOST + "resetpassword";
        this.dataService.postService(apiUrl, this.forgotPasswordForm.value).subscribe(res => {
            if(res.data==true){
                loader.dismiss();
                this.userverify();
                this.navCtrl.pop();
            }
            else{
                showToast(this.toastCtrl, res.msg);
            }
           
            
        }, error => {
            console.error(error);
            loader.dismiss();
            showToast(this.toastCtrl, 'Something went wrong!');
        });
    } else {
        showToast(this.toastCtrl, 'Please enter email to reset password');
    }

}

isLoaded: boolean = false;
userverify(){
    const prompt = this.alertCtrl.create({
        enableBackdropDismiss:false,
        //title: 'Otp',
        inputs: [
          {
            name: 'password',
            type: 'password',
            placeholder: 'Enter Your new Password'
          },
          {
            name: 'otp',
            placeholder: 'Enter Otp'
          },
        ],
        buttons: [
          {
            text: 'Submit',
            handler: data => {
              let validateObj = this.validateOtp(data);
              if (!validateObj.isValid) {
                  showToast(this.toastCtrl,validateObj.message );
                  return false;
              } 
              else{
                let loader = this.loading.create({ spinner: "crescent" });
                loader.present();
                let apiUrl = API_HOST + "verifyotp";
               
                this.dataService.postService(apiUrl, data).subscribe(res => {
                  loader.dismiss();
                  showToast(this.toastCtrl, res.message);
                   this.navCtrl.push(LoginPage);
                }, error => {
                    console.error(error);
                    showToast(this.toastCtrl, 'Something went wrong!');
                });
              }
          }
               
          }
        ]
      });
      prompt.present();
    }

    validateOtp(data) {
      if (data.otp && data.password) {
          return {
              isValid: true,
              message: ''
          };
      } else {
          return {
              isValid: false,
              message: 'please enter the required field'
          }
      }
  }
 



}
