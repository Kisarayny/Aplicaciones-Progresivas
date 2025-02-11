import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  username: string = '';
  password: string = '';
  isValid: boolean = false; //Indica su user o pas estan vacios
  showUsernameError: boolean = false;
  showPasswordError: boolean = false;//muestan msj de error 

  //constructor para mistrar modal
  constructor(private alertController: AlertController) {}
  //Se manda a llamar cuando se pican
  validateFields(event: any, field: string) {
    let inputValue = event.target.value;

    // Elimina espacios y acepta puras minúsculas
    if (field === 'username') {
      this.username = inputValue.replace(/\s/g, '').toLowerCase();
      this.showUsernameError = this.username.length === 0; // Muestra error si está vacío
    } else if (field === 'password') {
      this.password = inputValue.replace(/\s/g, '');
      this.showPasswordError = this.password.length === 0; // Muestra error si está vacío
    }

    // Valida si ambos campos están llenos y sin espacios
    this.isValid = this.username.length > 0 && this.password.length > 0;

    // Actualiza el valor en el input
    event.target.value = field === 'username' ? this.username : this.password;
  }

  //Funcion con el AlertController abre la modal
  async openModal() {
    const alert = await this.alertController.create({
      header: 'Los Datos Ingresados',
      message: '', // Deja el mensaje vacío
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('Cierra la modal');
        }
      }],
      cssClass: 'custom-alert'
    });
  
    // muestra modal de manera asincrona
    await alert.present();
  
   //document.querySelector('.custom-alert .alert-message'): Busca dentro de la modal el contenedor del 
   // mensaje (que está dentro de la clase .alert-message de la modal)
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
}
