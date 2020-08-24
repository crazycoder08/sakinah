import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MembershipplanPage } from './membershipplan';

@NgModule({
  declarations: [
    MembershipplanPage,
  ],
  imports: [
    IonicPageModule.forChild(MembershipplanPage),
  ],
})
export class MembershipplanPageModule {}
