import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html', 
  styleUrls: ['users.page.scss'],
  standalone:false,
})
export class UsersPage implements OnInit {
  users: any[] = [];  // Almacenará los usuarios obtenidos de Firestore

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  // 🟢 Método para obtener usuarios desde Firestore
  async loadUsers() {
    try {
      const usersCollectionRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);
      this.users = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };  // Agregar id del documento para referencia
      });
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  }

  // Método opcional para actualizar la lista después de editar
  updateUserList(updatedUser: any) {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;  // Actualiza el usuario en la lista
    }
  }
}
