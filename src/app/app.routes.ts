// import { Routes } from '@angular/router';

// export const routes: Routes = [];
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from '../guards/auth.guard';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard],
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ],
    },
            { path: 'login', component: LoginComponent },
            // { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
];
