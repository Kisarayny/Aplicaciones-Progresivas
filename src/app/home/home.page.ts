import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  username: string = '';

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Obtener el usuario almacenado (si quieres manejar esto mejor, podemos usar un servicio)
    const storedUser = localStorage.getItem('username');
    this.username = storedUser ? storedUser : 'Usuario';
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
  }

  goToTabs() {
    this.navCtrl.navigateRoot('/tabs'); // Redirige a la página de Tabs
  }
}
