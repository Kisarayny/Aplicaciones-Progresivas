import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  standalone: false,
})
export class AddUserPage {
  email: string = '';
  fullName: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthDate: string = '';
  role: string = 'user';  // Define el rol aquí, o puede ser elegido por el admin

  showEmailError: boolean = false;
  showFullNameError: boolean = false;
  showUsernameError: boolean = false;
  showPasswordError: boolean = false;
  showConfirmPasswordError: boolean = false;
  showBirthDateError: boolean = false;
  showRoleError: boolean = false; // Para validar el rol
  isValid: boolean = false;

  constructor(
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  validateFields(event: any, field: string) {
    const value = event.target.value;

    switch (field) {
      case 'email':
        this.email = value.replace(/\s/g, '');
        this.showEmailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'fullName':
        this.fullName = value.toUpperCase();
        this.showFullNameError = value.trim() === '';
        break;
      case 'username':
        this.username = value.replace(/\s/g, '');
        this.showUsernameError = value.trim() === '';
        break;
      case 'password':
        this.password = value.replace(/\s/g, '');
        this.showPasswordError = value.trim() === '';
        break;
      case 'confirmPassword':
        this.confirmPassword = value.replace(/\s/g, '');
        this.showConfirmPasswordError = value !== this.password;
        break;
      case 'birthDate':
        this.showBirthDateError = value.trim() === '';
        break;
      case 'role':
        this.role = value; // Validar rol
        this.showRoleError = value.trim() === '';
        break;
    }

    this.isValid = !(
      this.showEmailError ||
      this.showFullNameError ||
      this.showUsernameError ||
      this.showPasswordError ||
      this.showConfirmPasswordError ||
      this.showBirthDateError ||
      this.showRoleError // Asegúrate de que el rol esté incluido
    );
  }

  async registerUser() {
    if (!this.isValid) {
      console.log('Error: Verifica los datos antes de registrarte');
      return;
    }

    try {
      const response = await this.authService.registerUser(
        this.email,
        this.fullName,
        this.username,
        this.password,
        this.birthDate,
        this.role  // Pasa el valor de role aquí
      );

      const alert = await this.alertController.create({
        header: response.success ? 'Éxito' : 'Error',
        message: response.message,
        buttons: ['OK'],
      });

      await alert.present();

      if (response.success) {
        // Limpiar los campos si el registro fue exitoso
        this.email = '';
        this.fullName = '';
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.birthDate = '';
        this.role = ''; // Limpiar el rol
        this.isValid = false;
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }
}
