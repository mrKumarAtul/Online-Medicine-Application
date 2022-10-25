import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public apiURL = 'http://localhost:8000';

  constructor(private router: Router, private toastController: ToastController,
    public cart: CartServiceService) { }

  ngOnInit() { }

  changePassword() {
    const oldPassword: string = document.getElementById('oldPassword')['value'];
    const newPassword: string = document.getElementById('newPassword')['value'];
    if (oldPassword.trim().length <= 5) {
      alert('Old password length less than 6')
    } else if (newPassword.trim().length <= 5) {
      alert('New password length less than 6')
    }

    const data = {
      old: oldPassword,
      new: newPassword,
      email: this.cart.userEmail
    }
    this.cart.loadingCtrl.create();

    fetch(this.apiURL + '/changePassword', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data: { operation: string, username?: string, email?: string }) => {
        console.log('Success:', data);
        if (data.operation.includes('mismatch')) {
          const msg = `Current password is wrong`;
          alert(msg);
        } else if (data.operation.includes('success')) {
          setTimeout(() => this.cart.loadingCtrl.dismiss(), 3000)
          this.presentToast('top', `Password changed`);
          document.getElementById('oldPassword')['value'] = '';
          document.getElementById('newPassword')['value'] = '';
          this.goHome();
          //  this.loginSuccess = true;
          // this.cart.userName = data.username;
          //this.cart.userEmail = data.email;
          // this.appComponent.showSignUpPage = false;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setTimeout(() => this.cart.loadingCtrl.dismiss(), 2000)
      });
  }
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position
    });

    await toast.present();
  }

  goHome() {
    this.router.navigate(['/tabs/tab1']);
  }
}
