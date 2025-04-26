import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { baseUrl } from '../../app.component'; // Adjust the import path as necessary

import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatListModule } from "@angular/material/list"
import { MatDividerModule } from "@angular/material/divider"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSnackBarModule } from "@angular/material/snack-bar"

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule,MatToolbarModule, MatDividerModule,MatSnackBarModule,HttpClientModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatListModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  newUser = { NameUser: '', Email: '', Password: '', Role: 'User'};
  hidePassword:boolean = true;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>('https://warranty-server-g7vn.onrender.com/api/User', { headers })
      .subscribe(data => {
        console.log(data);
        
        this.users = data});
  }

  deleteUser(id: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.delete(`https://warranty-server-g7vn.onrender.com/api/User/${id}`, { headers })
      .subscribe(() => this.fetchUsers());
  }

  addUser() {
    const token = sessionStorage.getItem('token');
    console.log(token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    console.log(this.newUser);

    this.http.post(`${baseUrl}Auth/register`, this.newUser)
      .subscribe(() => {
        this.fetchUsers();
        this.newUser = { NameUser: '', Email: '', Password: '', Role: 'User'};
      });
  }
}
