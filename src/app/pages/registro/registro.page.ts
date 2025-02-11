import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

//Debe validar que que los inputs no permitan espacio  (excepto full name, este debe tener valido para 
// que guarde siempre por defecto en mayusculas, aun cuando el usuario ingrese minúsculas),
// 
// 
// además de validar que los campos de password y confirm password indiquen un 
// mensaje al momento de que coinciden o no coinciden las contraseñas,
// 
//  ademas de validar que el correo sea valido, en caso de que el formulario 
// no sea valido debe mostrar mensajes al usuario.
// 
// el botón debe estar deshabilitado hasta que el formulario sea valido. 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})


export class RegistroPage {
  email: string = '';
  fullName: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthDate: string = '';

  showEmailError: boolean = false;
  showFullNameError: boolean = false;  
  showUsernameError: boolean = false;
  showPasswordError: boolean = false;
  showConfirmPasswordError: boolean = false;
  showBirthDateError: boolean = false;  

  isValid: boolean = false;

  usuariosregistrados: any [] = [] //Array para almacenar los datos

  constructor(){
    //cargan los registros del localstorage
    const cargarusers = localStorage.getItem('usuariosresgistrados');
    if (cargarusers) {
      this.usuariosregistrados = JSON.parse(cargarusers); 
    }

  }

  validateFields(event: any, field: string) {
    const value = event.target.value;
    console.log(`Si sevalido: ${field}, Respuesta: ${value}`);

    switch (field) {
      case 'email':
        this.email = value.replace(/\s/g, '');// Jiji elimina los espacios en blanco
        this.showEmailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); //
        console.log('Se agrego correo', !this.showEmailError);
        break;
      case 'fullName':
        this.fullName = value.toUpperCase(); //Convertir a mayusculas el fullname
        this.showFullNameError = value.trim() === '';
        console.log('Se agrego apellido', !this.showFullNameError);
       
        break;
      case 'username':
        this.username = value.replace(/\s/g, ''); //Eliminar los espacios en blanco
        this.showUsernameError = value.trim() === '';
        console.log('Se agrego el nombre de usaurio', !this.showUsernameError);
        break;
      case 'password':
        this.password = value.replace(/\s/g, ''); //Eliminar los espacios en vlanco
        this.showPasswordError = value.trim() === '';
        console.log('Se agrego contraseña', !this.showPasswordError);
       
        break;
      case 'confirmPassword':
        this.confirmPassword = value.replace(/\s/g, '');
        this.showConfirmPasswordError = value !== this.password;
        console.log('Si son iguales las contraseñas', !this.showConfirmPasswordError);
       
        break;
      case 'birthDate':
        this.showBirthDateError = value.trim() === '';
        console.log('Si se agrego la fecha', !this.showBirthDateError);
        
        break;
    }

    this.isValid = !(
      this.showEmailError ||
      this.showFullNameError ||
      this.showUsernameError ||
      this.showPasswordError ||
      this.showConfirmPasswordError ||
      this.showBirthDateError
    );
    console.log('El formulario si salio', this.isValid);
  }

  registerUser() {
    if (this.isValid) {
      // Crear un objeto con los datos del usuario
      const nuevousuario = {
        email: this.email,
        fullName: this.fullName,
        username: this.username,
        birthDate: this.birthDate,
        password: this.password 
      };
  
      // Agrega el usuario al array
      this.usuariosregistrados.push(nuevousuario);
  
      // Guardar el array actualizado en localStorage
      localStorage.setItem('users', JSON.stringify(this.usuariosregistrados));
  
      console.log('Se registro el usuario de manera exitosa:', nuevousuario);
    
      // Limpiar los campos después de registrar el usuario
    this.email = '';
    this.fullName = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.birthDate = '';

    // Resetear los errores
    this.showEmailError = false;
    this.showFullNameError = false;
    this.showUsernameError = false;
    this.showPasswordError = false;
    this.showConfirmPasswordError = false;
    this.showBirthDateError = false;

    // Deshabilitar el botón hasta que todos los campos sean válidos nuevamente
    this.isValid = false;
    
    
    } else {
      console.log('UPS Algo paso al registrase');
      
    }
      // Mostrar todos los usuarios en la consola
      console.log('Usuarios registrados:', this.usuariosregistrados);
  }
  
}
