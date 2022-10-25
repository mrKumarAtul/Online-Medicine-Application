import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MedicineListService } from '../services/medicine-list.service';
import { CartServiceService } from '../services/cart-service.service';
import { AppComponent } from '../app.component';
import { CartComponent } from '../CartComponent';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  medicineList = [];
  APImedicineList = [];
  showCart: boolean = false;
  textInSearchBox: boolean = false;
  orderHistory = [];
  public apiURL = 'http://localhost:8000';


  constructor(public medicineService: MedicineListService, public cartCom: CartComponent,
    private router: Router, private cart: CartServiceService, public appComponent: AppComponent) { }
  ngOnInit() {
    this.medicineService.getJSON();
    this.medicineService.getJSON().then((data) => {
      console.log(data);
      this.medicineList = data;
      this.APImedicineList = data;
      this.orderHistory = this.cart.getOrderHistoryForOrderPage();
    });
  }

  checkOutClicked(): void {
    this.showCart = !this.showCart;
    this.cartCom.checkOutClicked();
  }

  showMedicineDetails(selectedMedicine): void {
    this.router.navigate(['/medicine-details'], { queryParams: selectedMedicine });
  }

  viewCartClicked(): void {
    //this.showCart = true;
    this.router.navigate(['/cart']);
  }

  searchItem(): void | boolean {
    let item: string = document.getElementById('search')['value'];
    if (item.trim().length <= 0) {
      alert('Enter valid search item');
      return false;
    } else {
      this.textInSearchBox = true;
      this.cart.showLoading('Searching ...');
      item = item.toLowerCase();
      console.log('item : ', item);
      const allMedicine = this.medicineService.getJSON();
      allMedicine.then((data) => {
        console.log('allMedicine ', data);
        const result = data.filter((val) => val.name.toLowerCase().includes(item))
        console.log('result:', result);
        this.medicineList = result;
        setTimeout(() => {
          this.cart.hideLoading();
        }, 200);
      });
    }

  }
  resetSearch(): void {
    let item: HTMLElement = document.getElementById('search');
    item['value'] = '';
    this.medicineList = [];
    this.textInSearchBox = false;
    this.medicineList = this.APImedicineList;
  }
  dropDownChange(event) {
    console.log(event.detail.value);
    let res = this.cart.dropDownManager(event);
    if (res.includes('logout')) {
      this.appComponent.loginSuccess = false;
    }
  }
  seeMedicineList(): void {
    this.textInSearchBox = true;
    if ((this.medicineList.length > 0) === false) {
      alert('No medicines found in Database')
    }
  }
  refillMedicine(orderID: string): void {
    console.log('art.cartProducts', this.cart.cartProducts);
    console.log('host', orderID);
    fetch(this.apiURL + '/refill', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderid: orderID,
        email: this.cart.userEmail
      }),
    })
      .then((response) => response.json())
      .then((data: { operation: string, username?: string, email?: string }) => {
        console.log('Success:', data);
        if(data.operation.includes('success')) {
          this.cart.showLoading('Order refill success, order check out success ...');
          setTimeout(() => this.cart.hideLoading(), 4000);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setTimeout(() => this.cart.hideLoading(), 2000);
      });
  }
}
