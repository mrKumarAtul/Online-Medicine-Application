import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineListService {
  public apiURL = 'http://localhost:8000';

  constructor() {
    // this.getJSON().subscribe(data => {
    //     console.log(data);
    // });
  }
  public sendData() {
    return 123
  }

  public getJSON() {
    const url = this.apiURL + '/medicines'
    return fetch(url, {
      method:'POST'
    }).then(res => res.json()).then((data) => data)
  }

  // fetch(this.apiURL + '/checkout', {
  //   method: 'POST', // or 'PUT'
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(userData),
  // })
  //   .then((response) => response.json())
  //   .then((data: { operation: string, username?: string, email?: string }) => {
  //     console.log('Success:', data);
  //     if (data.operation.includes('success')) {
  //       this.presentToast('top', 'Cartout Success');
  //       this.cart.cartProducts = [];
  //       let selectedMedicine = {
  //         reloadOrder: true
  //       };
  //       // this.router.navigate(['/tabs/tab1']);
  //       this.router.navigate(['/tabs/tab1'], { queryParams: selectedMedicine });

  //     }

  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
}
