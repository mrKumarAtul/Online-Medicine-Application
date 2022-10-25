import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CartServiceService } from './services/cart-service.service';

@Component({
  selector: 'CartComponent',
  templateUrl: 'CartComponent.html'
})
export class CartComponent implements OnInit {
  @Input() name: string;
  public apiURL = 'http://localhost:8000';


  medicineList = [];
  constructor(private cart: CartServiceService, private toastController: ToastController,
    private router: Router, private activate: ActivatedRoute) { }
  ngOnInit() {
    console.log('CartComponent - ngOnInit');


    this.medicineList = this.cart.getCartDetails()
    console.log(this.cart.getCartDetails())

  }
  checkOutClicked(): void | boolean {
    // if (this.cart.userEmail.length <= 0) {
    //   //return false;
    //   this.cart.userEmail = 'admin@admin.com'
    // }
    if (this.cart.cartProducts.length <= 0) {
      this.presentToast('top', 'No items in cart');
      return false;
    }
    const userData = {
      orders: this.cart.getCartDetails(),
      user: this.cart.userEmail
    };
    console.log('data to send to API', userData);
    console.log(this.cart.getCartDetails());
    fetch(this.apiURL + '/checkout', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data: { operation: string, username?: string, email?: string }) => {
        console.log('Success:', data);
        if (data.operation.includes('success')) {
          this.presentToast('top', 'Cartout Success');
          this.cart.cartProducts = [];
          let selectedMedicine = {
            reloadOrder: true
          };
          this.cart.cartTotal = 0;
          // this.router.navigate(['/tabs/tab1']);
          this.router.navigate(['/tabs/tab1'], { queryParams: selectedMedicine });

        }

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }
  backToOrders() {
    this.router.navigate(['/tabs/tab3']);
  }
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position
    });

    await toast.present();
  }
}
