import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MedicineListService } from './services/medicine-list.service';
import { CartServiceService } from './services/cart-service.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component'
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CartComponent } from './CartComponent';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SignUpComponent, MedicineDetailsComponent,ChangePasswordComponent,CartComponent],
  imports: [FormsModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, CommonModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MedicineListService, CartServiceService, HttpClientModule, HttpClient,CartComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
