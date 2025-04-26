import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService  {

  private baseUrl = 'https://warranty-server-g7vn.onrender.com/api/Auth/login'
  public user = new BehaviorSubject<User>({ id: 0, name: '', email: '', password: '', role: '' });
  user$ = this.user.asObservable();
  constructor(private http: HttpClient) {this.onInit(); }
onInit(){
  this.getById(
    this.getUserId()).subscribe(user => {
      console.log(user.id);
      
    this.setUser(user);
  });
}

getUserId(): number | null {
  const token = sessionStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.userId; // מחזיר את ה-ID של המשתמש
  } catch (error) {
    console.error('שגיאה בפענוח ה-Token:', error);
    return null;
  }
}

getById(id: number|null): Observable<User> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<User>(`${this.baseUrl}/${id}`, { headers });
}

setUser(user: User) {
  this.user.next(user);
}
getAllUsers(): Observable<User[]> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<User[]>(this.baseUrl,{headers});
}

deleteUser(userId: number): Observable<void> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<void>(`${this.baseUrl}/${userId}`,{headers});
}
}