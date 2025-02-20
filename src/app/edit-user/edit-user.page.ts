import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-user',
  templateUrl: 'edit-user.page.html',
  styleUrls: ['edit-user.page.scss'],
  standalone: false
})
export class EditUserPage implements OnInit {
  users: any[] = [];  // Lista de usuarios
  selectedUserId: string = '';  // ID del usuario seleccionado
  email: string = '';
  fullName: string = '';
  username: string = '';
  password: string = '';
  birthDate: string = '';

  constructor(
    private firestore: Firestore,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  // Cargar todos los usuarios desde Firestore
  async loadUsers() {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    this.users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Cargar los datos del usuario seleccionado en el formulario
  async loadUserData() {
    if (!this.selectedUserId) return;

    const userDocRef = doc(this.firestore, 'users', this.selectedUserId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      this.email = userData['email'];
      this.fullName = userData['fullName'];
      this.username = userData['username'];
      this.password = userData['password'];  // Ojo con el cifrado de la contraseña
      this.birthDate = userData['birthDate'];
    } else {
      console.error('Usuario no encontrado');
    }
  }

  // Actualizar los datos del usuario seleccionado
  async updateUser() {
    if (!this.selectedUserId) return;

    try {
      const userDocRef = doc(this.firestore, 'users', this.selectedUserId);
      await updateDoc(userDocRef, {
        email: this.email,
        fullName: this.fullName,
        username: this.username,
        password: this.password,  // Asegúrate de cifrar la contraseña antes de guardar
        birthDate: this.birthDate,
      });

      // Limpiar el formulario y actualizar la lista de usuarios
      this.clearForm();
      await this.loadUsers();

      // Redirigir a la lista de usuarios después de la actualización
      this.router.navigate(['/tabs/users']);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Hubo un error al actualizar el usuario');
    }
    // Dentro de updateUser() de edit-user.page.ts
this.router.navigate(['/tabs/users'], { queryParams: { refresh: true } });

  }

  // Limpiar el formulario
  clearForm() {
    this.selectedUserId = '';
    this.email = '';
    this.fullName = '';
    this.username = '';
    this.password = '';
    this.birthDate = '';
  }
}
