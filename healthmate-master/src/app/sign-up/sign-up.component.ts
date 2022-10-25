import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public apiURL = 'http://localhost:8000';

  constructor(private toastController: ToastController,
    private loadingCtrl: LoadingController, public appComponent: AppComponent) { }

  ngOnInit() { }

  registerClicked(): void {
    this.validateDetails();
  }
  validateDetails(): void | boolean {
    console.log(document.getElementById('name')['value'])
    const name: string = document.getElementById('name')['value'];
    const email: string = document.getElementById('email')['value'];
    const password: string = document.getElementById('password')['value'];

    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (name.trim().length === 0) {
      this.presentToast('top', 'Enter valid name');
      return false;
    }
    if (email.trim().length === 0 || (emailFilter.test(email) === false)) {
      this.presentToast('top', 'Enter valid email');
      return false;
    }
    if (password.trim().length < 5) {
      this.presentToast('top', 'Enter valid password');
      return false;
    }
    this.showLoading();
    this.createUser({
      name,email,password
    });
    console.log(name, email, password)


  }
  backToLogin(): void {
    this.appComponent.showSignUpPage = false;

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
    const loading = await this.loadingCtrl.create({ message: 'Creating user ....' });
    loading.present();
  }
  createUser(userData) {
    fetch(this.apiURL + '/createUser', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data: {operation: string}) => {
        console.log('Success:', data);
        if(data.operation.includes('duplicate')) { 
          const msg = `User with email id :${userData.email} already exists`;
          alert(msg);
          this.loadingCtrl.dismiss();
          this.appComponent.showSignUpPage = true;;
        } else {
          this.loadingCtrl.dismiss();
          this.appComponent.showSignUpPage = false;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
