import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartServiceService } from '../services/cart-service.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  prevOrders$ = [];
  public apiURL = 'http://localhost:8000';
  cardMenu = [
    {
      title: 'Book Doctor Appointment',
      desc: 'Book Doctor Appointment',
      imageURL: '../../assets/stethoscope.webp'
    },
    {
      title: 'Book Lab Appointment',
      desc: 'Book Lab Appointment',
      imageURL: '../../assets/microscope.jpeg'
    },
    {
      title: 'Order Medicine',
      desc: 'Book Doctor Appointment',
      imageURL: '../../assets/hand.png'
    }
  ];
  constructor(private router: Router, public appComponent: AppComponent,
    public cart: CartServiceService, private activate: ActivatedRoute) { }

  ngOnInit() {
    //this.prevOrders$ = this.cart.getPreviousOrders();
    this.getOrders();
    this.activate.queryParams.subscribe((params: { reloadOrder: string }) => {
      console.log(params);
      if (params.reloadOrder === 'true') {
        this.getOrders();
      }
    });
  }

  getOrders() {

    fetch(this.apiURL + '/orders', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.cart.userEmail
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success- getOrders- :', data);
        this.prevOrders$ = this.cart.createOrderDataInUICompatible(data);;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  cardClicked(title: string) {
    if (title.toLowerCase().includes('order')) {
      this.router.navigate(['/tabs/tab3']);
    } else {
      this.router.navigate(['/tabs/tab2']);
    }
  }
  goToCart() {
    this.router.navigate(['/tabs/tab3']);
  }
  dropDownChange(event) {
    console.log(event.detail.value);
    let res = this.cart.dropDownManager(event);
    if (res.includes('logout')) {
      this.appComponent.loginSuccess = false;
    }
  }
}
