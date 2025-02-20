import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userData: any = null;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async ngOnInit() {
    await this.loadUserProfile();
  }

  // 🔹 Cargar la información del usuario autenticado
  async loadUserProfile() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.userData = userDoc.data();
      }
    }
  }
}
