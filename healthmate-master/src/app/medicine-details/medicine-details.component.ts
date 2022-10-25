import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-medicine-details',
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.scss'],
})
export class MedicineDetailsComponent implements OnInit {
  @Input() details;
  public isLoading: boolean = false;
  units:number = 1;
  fileUploadSuccess: boolean = false;
  constructor(private router: ActivatedRoute,
    private navigateRouter: Router, private cart: CartServiceService) { }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      console.log(params);
      this.details = params;
      this.isLoading = false;
    })
  }
  backToMedicine(): void {
    this.navigateRouter.navigate(['/tabs/tab3']);
  }
  addToCart(): void |boolean {
    console.log('clicked');
    if(this.details.prescribed === 'true' && this.fileUploadSuccess === false) {
      alert('Please upload Medical Prescription before adding into cart');  
      return false;
    }
    let units = document.getElementById('units')['value'];
    console.log('units', typeof units);
    let intCondition = parseInt(units);
    if(isNaN(intCondition) || intCondition <=0) {
      alert('Add valid units');
      return false;
    } 
    else if((units.trim().length > 0) === false ) {
      alert('Add units');
      return false
    } 
    console.log('this.details',units,this.details);
    this.isLoading = true;
    this.cart.showLoading('Adding item...').then((loading) => {
      this.cart.addItemIntoCart(this.details, units);
      this.navigateRouter.navigate(['/tabs/tab3']);
    });

  }
  uploadButtonClicked() {
    const fileName = document.getElementById('inputGroupFile01')['value'];
    if(fileName && fileName.length > 0) {
      let splitLength = fileName.split('\\');
      let name = splitLength[splitLength.length -1];
      console.log('File name is',splitLength);
      this.fileUploadSuccess = true;
    } else {
      alert('Please choose file firstly and click on upload');
    }
  }

}
