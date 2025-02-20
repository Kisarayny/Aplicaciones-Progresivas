import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const token = await this.authService.getCurrentUser();  // Este método obtiene el usuario autenticado.
    
    if (token && token.role === 'admin') {
      return true; // Permite el acceso si el rol es 'admin'.
    }
    
    // Si no tiene el rol de 'admin', redirige al login (o a cualquier otra página).
    this.router.navigate(['/login']);
    return false;
  }
}
