import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  public userName: string = 'Default';
  public userEmail = '';
  public cartTotal: number = 0;
  public cartProducts: Array<any> = [];
  public orderHistory = [];
  
  constructor(private toastController: ToastController, 
    public loadingCtrl: LoadingController,
    private router: Router) { }

  getCartDetails(): Array<any> {
    return this.cartProducts;
  }
  addItemIntoCart(item: any, units:number) {
    console.log(this.cartProducts)

    if (this.cartProducts.length > 0 && this.cartProducts.find((val) => val.name === item.name)) {
      // item already exists
      const findIndex = this.cartProducts.findIndex((val) => val.name === item.name)
      console.log('findIndex ', findIndex);
      console.log('this.cartProducts; ', this.cartProducts);
      this.cartProducts[findIndex]['quantity'] = this.cartProducts[findIndex]['quantity'] + 1;

    }
    else {
      // item not exists
      const medi = {...item, 'quantity': units};
      medi['quantity'] = units;
      this.cartProducts.push(medi);
    }
    console.log(this.cartProducts);
    let total = 0;
    for(let i = 0;i < this.cartProducts.length;i++ ) {
      total = total + (parseInt(this.cartProducts[i].price) * parseInt(this.cartProducts[i].quantity)) 
    }
    console.log('tota', total);
    this.cartTotal = total;
    this.hideLoading();
  }
   
  getPreviousOrders() : Array<any> {
    return this.cartProducts;
  }


  async showLoading(msg: string, timeout?: number) {
    console.log('load')
    const loading = await this.loadingCtrl.create({message: msg });
    loading.present();
  }
   hideLoading() {
    this.loadingCtrl.dismiss();
  }
  dropDownManager(event) : string {
    const operation: string = event.detail.value.toLowerCase();
    if (operation.includes('cart')) {
      this.router.navigate(['/cart']);
    } else if (operation.includes('logout')) {
      this.userName = '';
      this.userEmail = '';
    }
    else {
      this.router.navigate(['/change-password']);
    }
    return operation;
  }

  createOrderDataInUICompatible(data) : Array<any> {
    const orderIDArray = [];
    data.orders.forEach((ele) => {
      if (orderIDArray.includes(ele.orderid) === false )
        orderIDArray.push(ele.orderid)
    });
    console.log('orderIDArray ', orderIDArray);
    let reqOrders = [...new Set(orderIDArray)];
    console.log('reqOrders ', reqOrders);
    let orderCatalog:Array<{orderId:string, 
      product: Array<{id: number, email: string, orderid: string, productName: string, units: string}>}> = [];
    reqOrders.forEach((order) => {
      orderCatalog.push({
        orderId: order,
        product: data.orders.filter((val) => val.orderid === order)
      });

    });
    console.log('orderCatalog',orderCatalog);
    this.orderHistory = orderCatalog;
    return orderCatalog;
  }
  getOrderHistoryForOrderPage() : Array<{orderId:string, 
    product: Array<{id: number, email: string, orderid: string, productName: string, units: string}>}>  {

    if(this.orderHistory.length > 0) {
      return this.orderHistory.reverse().slice(0,3);
    }
    else {
      return [];
    }
  }

}
