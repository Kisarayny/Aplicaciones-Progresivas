import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private secretKey = 'mi_clave_secreta';  // Clave para cifrado

  constructor(private firestore: Firestore) {}

  // 🟢 Registro de usuario con cifrado de contraseña y rol
  async registerUser(email: string, fullName: string, username: string, password: string, birthDate: string, role: string) {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userUid = userCredential.user.uid;

      // Cifrar la contraseña y el rol antes de guardarlos
      const encryptedPassword = CryptoJS.AES.encrypt(password, this.secretKey).toString();
      const encryptedRole = CryptoJS.AES.encrypt(role, this.secretKey).toString();  // Cifrar el rol

      const userDocRef = doc(this.firestore, 'users', userUid);
      await setDoc(userDocRef, {
        email,
        fullName,
        username,
        birthDate,
        password: encryptedPassword,  // Guardamos la contraseña cifrada
        role: encryptedRole,  // Guardamos el rol cifrado
        last_login: new Date(),
        uid: userUid,
      });

      return { success: true, message: 'Usuario registrado correctamente' };
    } catch (error) {
      return { success: false, message: 'Error al registrar usuario: ' + (error as any).message };
    }
  }

  // 🟢 Iniciar sesión con verificación de contraseña y obtención de rol y permisos
  async login(email: string, password: string) {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userUid = userCredential.user.uid;

      const userDocRef = doc(this.firestore, 'users', userUid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error('Usuario no encontrado en la base de datos');

      const userData = userDoc.data();

      // 🔑 Descifrar la contraseña para validación
      const bytesPassword = CryptoJS.AES.decrypt(userData['password'], this.secretKey);
      const originalPassword = bytesPassword.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== password) throw new Error('Contraseña incorrecta');

      // 🔑 Descifrar el rol
      const bytesRole = CryptoJS.AES.decrypt(userData['role'], this.secretKey);
      const originalRole = bytesRole.toString(CryptoJS.enc.Utf8);

      // 🔍 Obtener los permisos del rol
      const permissions = await this.getPermissions(originalRole);

      // 🔥 Generar token con email, rol y permisos
      const token = { email, role: originalRole, permissions };
      return token;
    } catch (error) {
      throw new Error((error as any).message || 'Error de autenticación');
    }
  }

  // 📌 Obtener los permisos del rol desde Firestore
  async getPermissions(role: string): Promise<string[]> {
    try {
      const roleDocRef = doc(this.firestore, 'roles', role);
      const roleDoc = await getDoc(roleDocRef);
      if (roleDoc.exists()) {
        return roleDoc.data()['permissions'] || [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error obteniendo permisos:', error);
      return [];
    }
  }

  // Verificar si el usuario tiene un permiso específico
  async hasPermissionToAddUser(userUid: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, 'users', userUid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userDoc.data();
    
    // 🔑 Descifrar el rol
    const bytesRole = CryptoJS.AES.decrypt(userData['role'], this.secretKey);
    const originalRole = bytesRole.toString(CryptoJS.enc.Utf8);
    
    // Obtener los permisos del rol
    const permissions = await this.getPermissions(originalRole);
    
    // Verificar si el rol tiene el permiso 'add_users'
    return permissions.includes('add_users');
  }
}
