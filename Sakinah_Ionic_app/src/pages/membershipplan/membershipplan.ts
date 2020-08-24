import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Platform } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { API_HOST, toastOptions } from '../../app/main';
import { showToast } from '../../app/app.component';
// import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
/**
 * Generated class for the MembershipplanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-membershipplan',
  templateUrl: 'membershipplan.html',
})
export class MembershipplanPage {
  userData:any=[];
  memberShipPlans:any=[];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl:AlertController,
    public platform: Platform,
    public dataService: DataServiceProvider,
    //public paypal :PayPal
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembershipplanPage');
    this.membershipPlan();
  }

  membershipPlan(){
    let loader = this.loading.create({ spinner: "crescent" });
    loader.present();
    let apiUrl = API_HOST + "homescreenapi";
    this.dataService.postService(apiUrl,{}).subscribe(res => {
        loader.dismiss();
        this.userData=res.data.user;
        this.memberShipPlans = res.data.subscriptionPlan;
    }, error => {
        console.error(error);
        loader.dismiss();
        showToast(this.toastCtrl, 'Something went wrong!');
    });
}
toggle(index) {
  if (this.memberShipPlans[index].open) {
    this.memberShipPlans[index].open = false;
    return;
  }
  for (let i = 0; i < this.memberShipPlans.length; i++) {
    this.memberShipPlans[i].open = false;
  }
  this.memberShipPlans[index].open = !this.memberShipPlans[index].open;
}
paymentDailog(id,firstname,planmrp,planname) {
  let alert = this.alertCtrl.create({
      title: "Pay "+ ""+ planmrp + " $ "+" for" +" "+planname +" Plan ",
      inputs: [
        // {
        //   type: 'radio',
        //   label: 'Using Paypal',
        //   value: 'paypal',
        //   checked: true
        // },
        {
          type: 'radio',
          label: 'Using Stripe',
          value: 'stripe'
        }
      ],
      buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Submit',
            handler: data => {
              console.log('Checkbox data:', data);
             // this.addpaymentToStripe(id,planmrp,firstname);
              // if(data=="paypal"){
              //     this.addAmountTopaypal(id,planmrp,firstname);
              // }
              // else{
              //     this.addpaymentToStripe(id,planmrp,firstname);
              // }
            }
          }
        ]
    
  });
  alert.present();
}

// addAmountTopaypal(serviceid,budget,pro_name) {  
 
//   if (!this.platform.is("cordova")) {
//       console.log("Cordova is not available - Run in physical device");
//       return;
//   }
//   this.paypal.init({
//       PayPalEnvironmentProduction: "this.serviceData.paypalProductionEnv",
//       PayPalEnvironmentSandbox: "AdHCVw5Bjx9-JBv2G30BuAn8w-QnxIr9CchmnJHHN4M6BykAwTEgjTM8jb_qewJSXaZzH1eXPB_Ef-X9"
//   }).then(() => {
//      // let environment = ((true) ? "PayPalEnvironmentSandbox" : "PayPalEnvironmentProduction");
//       this.paypal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
//       })).then(() => {
//           let payment = new PayPalPayment(budget, 'USD', 'Description', 'sale');
//           this.paypal.renderSinglePaymentUI(payment).then(res => {
//               console.log(res.response);
             
//           }, errorRender => {
//               console.log('onError Render: ', errorRender);
          
//              // this.loader.dismiss();
//               console.error(errorRender);
//               toastOptions.message = "Payment Failed..";
//               this.showToast();
             
//           });
//       }, errorConfig => {
        
//          // this.loader.dismiss();
//           console.error(errorConfig);
//           toastOptions.message = "Payment Failed";
//           this.showToast();
//       });
//   }, errorInit => {
  
//      // this.loader.dismiss();
//       console.error(errorInit);
//       toastOptions.message = "Payment Failed";
//       this.showToast();
//   });

// }
showToast() {
  let toast = this.toastCtrl.create(toastOptions);
  toast.present();
}

}
