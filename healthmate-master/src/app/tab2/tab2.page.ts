import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public cart: CartServiceService,public appComponent : AppComponent) {}
  dropDownChange(event) {
    console.log(event.detail.value);
    let res = this.cart.dropDownManager(event);
    if(res.includes('logout')) {
      this.appComponent.loginSuccess = false;
    }
  }
}
