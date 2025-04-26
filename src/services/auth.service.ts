
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://warranty-server-g7vn.onrender.com/api/Auth';

  constructor(private http: HttpClient, private userService: UserService,private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
  }
  

  getToken(): string | null {
    return sessionStorage.getItem('token');;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // פענוח הטוקן
      return payload.role || null;
    } catch (e) {
      console.error('שגיאה בפענוח הטוקן', e);
      return null;
    }
  }

  isTeacher(): boolean {
    return this.getUserRole() === 'teacher';
  }
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

}

