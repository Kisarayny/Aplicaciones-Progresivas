import { Component } from '@angular/core';
import { AlertController, NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isValid: boolean = false; // Indica si user o pass están vacíos
  showUsernameError: boolean = false;
  showPasswordError: boolean = false; // Muestra msj de error 
  showLoginForm: boolean = false; // Controla la visibilidad del formulario

  constructor(
    private alertController: AlertController, 
    private navCtrl: NavController, 
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    // Espera 3 segundos y luego muestra el formulario de login
    setTimeout(() => {
      this.showLoginForm = true;
    }, 3000);
  }

  validateFields(event: any, field: string) {
    let inputValue = event.target.value;

    if (field === 'username') {
      this.username = inputValue.replace(/\s/g, '').toLowerCase();
      this.showUsernameError = this.username.length === 0;
    } else if (field === 'password') {
      this.password = inputValue.replace(/\s/g, '');
      this.showPasswordError = this.password.length === 0;
    }

    this.isValid = this.username.length > 0 && this.password.length > 0;
    event.target.value = field === 'username' ? this.username : this.password;
  }

  async openModal() {
    const alert = await this.alertController.create({
      header: 'Los Datos Ingresados',
      message: '',
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('Cierra la modal');
        }
      }],
      cssClass: 'custom-alert'
    });

    await alert.present();

    const alertElement = document.querySelector('.custom-alert .alert-message');
    if (alertElement) {
      alertElement.innerHTML = `
        <div class="modal-content">
          <p><strong>Usuario:</strong> <span class="modal-text">${this.username}</span></p>
          <p><strong>Contraseña:</strong> <span class="modal-text">${this.password}</span></p>
        </div>
      `;
    }
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando credenciales...',
      duration: 3000
    });
  
    await loading.present();
  
    setTimeout(async () => {
      // Obtener la lista de usuarios desde el localStorage
      const storedUsers = localStorage.getItem('users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
  
      // Verificar si el usuario y contraseña ingresados coinciden con algún usuario registrado
      const validUser = users.find((user: any) => user.username === this.username && user.password === this.password);
  
      if (validUser) {
        // Si las credenciales son correctas, cambiar mensaje y redirigir a Home
        loading.message = 'Bienvenido!';
        
        // Esperamos 3 segundos para dar tiempo a ver el mensaje
        setTimeout(() => {
          loading.dismiss();
          this.navCtrl.navigateForward('/home');
        }, 1000);
      } else {
        // Si las credenciales son incorrectas, mostrar la alerta de error
        loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Credenciales incorrectas',
          buttons: ['OK']
        });
        
        await alert.present();
      }
    }, 3000); // Espera inicial de 3 segundos para mostrar el loading de "Verificando credenciales"
  }
}