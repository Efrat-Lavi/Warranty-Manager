import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  username: string | null = '';

  constructor(private router: Router) {
    const user = sessionStorage.getItem('user');
    if(user) {
      const parsedUser = JSON.parse(user);
      this.username = parsedUser.name;
    }
    // else {
    //   this.router.navigate(['/login']);
    // }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }
}
