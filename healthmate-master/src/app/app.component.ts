import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { CartServiceService } from './services/cart-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public loginSuccess: boolean = false;
  public showSignUpPage: boolean = false;
  public apiURL = 'http://localhost:8000';


  constructor(private toastController: ToastController,
    private loadingCtrl: LoadingController, private cart: CartServiceService) { }

  loginClicked() {
    console.log('loginClicked')
    const email: string = document.getElementById('email')['value'];
    const password: string = document.getElementById('password')['value'];
    console.log('signInClicked');
    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (email.trim().length === 0 || (emailFilter.test(email) === false)) {
      this.presentToast('top', 'Enter valid email');
      return false;
    }
    if (password.trim().length < 5) {
      this.presentToast('top', 'Enter valid password');
      return false;
    }
    this.findUser({
      email, password
    });
    return false;
  }

  signUpClicked(): void {
    this.showSignUpPage = true;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position
    });

    await toast.present();
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({ message: 'Fetching details.. ....' });
    loading.present();
  }

  findUser(userData) {
    console.log('findUser :', userData);
    this.showLoading();

    fetch(this.apiURL + '/login', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data: { operation: string, username?: string, email?: string }) => {
        console.log('Success:', data);
        if (data.operation.includes('Wrong password')) {
          const msg = `Wrong password`;
          this.presentToast('top', msg);
          this.loadingCtrl.dismiss();
          this.loginSuccess = false;
        } else if (data.operation.includes('success')) {
          setTimeout(() => this.loadingCtrl.dismiss(), 2000)
          this.presentToast('bottom', `Welcome ${data.username}`);
          this.loginSuccess = true;
          this.cart.userName = data.username;
          this.cart.userEmail = data.email;
          this.cart.cartTotal = 0;
          // this.appComponent.showSignUpPage = false;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
