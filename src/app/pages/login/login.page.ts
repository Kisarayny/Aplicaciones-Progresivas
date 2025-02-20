import { Component } from '@angular/core';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  username: string = '';
  password: string = '';

  showLoginForm: boolean = true;
  showUsernameError: boolean = false;
  showPasswordError: boolean = false;
  isValid: boolean = false;

  constructor(
    private alertController: AlertController, 
    private navCtrl: NavController, 
    private loadingCtrl: LoadingController,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    // Espera 3 segundos y luego muestra el formulario de login
    setTimeout(() => {
      this.showLoginForm = true;
    }, 3000);
  }
  
  validateFields(event: any, field: string) {
    const value = event.target.value.trim();

    if (field === 'username') {
      this.showUsernameError = value === '';
    } else if (field === 'password') {
      this.showPasswordError = value === '';
    }

    this.isValid = !this.showUsernameError && !this.showPasswordError;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando credenciales...',
      duration: 3000
    });

    await loading.present();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, this.username, this.password);
      
      // Obtener el UID del usuario autenticado
      const user = userCredential.user;
      console.log('✅ Usuario autenticado. UID:', user.uid);

      // Intentar obtener los datos del usuario desde Firestore
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      console.log('📄 Intentando obtener documento del usuario...');
      console.log('🔍 Documento encontrado:', userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('📄 Datos del usuario obtenidos:', userData);

        const role = userData['role']; // Acceder con corchetes para evitar error TS4111
        console.log('🔑 Rol del usuario:', role);

        // Redirigir según el rol
        if (role === 'admin') {
          this.navCtrl.navigateForward('/admin-home');
        } else {
          this.navCtrl.navigateForward('/home');
        }
      } else {
        console.error('❌ Documento de usuario no encontrado en Firestore.');
        throw new Error('No se pudo obtener los datos del usuario.');
      }

      loading.dismiss();

    } catch (error) {
      console.error('❌ Error de autenticación:', error);
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: (error as any).message || 'Credenciales incorrectas o usuario no encontrado.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
