import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Esto asegura que el servicio esté disponible globalmente
})
export class UsersService {
  private usersSubject = new BehaviorSubject<any[]>([]);  // Usamos BehaviorSubject para emitir los cambios
  users$ = this.usersSubject.asObservable();  // Observable que las páginas pueden suscribirse

  constructor(private firestore: Firestore) {}

  // 🟢 Método para obtener los usuarios desde Firestore
  async loadUsers() {
    try {
      const usersCollectionRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);
      const users = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };  // Agregar id del documento
      });

      this.usersSubject.next(users);  // Actualiza la lista de usuarios
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  }
}
