// // // // // import { Component } from '@angular/core';
// // // // // import { Router } from '@angular/router';
// // // // // import { HttpClient } from '@angular/common/http';
// // // // // import { FormsModule } from '@angular/forms';

// // // // // @Component({
// // // // //   selector: 'app-login',
// // // // //   standalone: true, // ← זה חובה כשיש imports
// // // // //   templateUrl: './login.component.html',
// // // // //   styleUrls: ['./login.component.css'],
// // // // //   imports: [FormsModule]
// // // // // })
// // // // // export class LoginComponent {
// // // // //   email = '';
// // // // //   password = '';
// // // // //   error = '';

// // // // //   constructor(private http: HttpClient, private router: Router) {}

// // // // //   login() {
// // // // //     this.http.post<any>('https://warranty-server-g7vn.onrender.com/api/Auth/login', {
// // // // //       email: this.email,
// // // // //       password: this.password
// // // // //     }).subscribe({
// // // // //       next: (res) => {
// // // // //         localStorage.setItem('token', res.token);
// // // // //         this.router.navigate(['/dashboard']);
// // // // //       },
// // // // //       error: () => {
// // // // //         this.error = 'Login failed. Check your credentials.';
// // // // //       }
// // // // //     });
// // // // //   }
// // // // // }
// // // // import { Component } from '@angular/core';
// // // // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // // // import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// // // // import { MatFormFieldModule } from '@angular/material/form-field';
// // // // import { MatInputModule } from '@angular/material/input';
// // // // import { MatButtonModule } from '@angular/material/button';
// // // // import { AuthService } from '../../../services/auth.service';
// // // // import { UserService } from '../../../services/user.service';

// // // // @Component({
// // // //   selector: 'app-login',
// // // //   standalone: true,
// // // //   imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
// // // //   templateUrl: './login.component.html',
// // // //   styleUrls: ['./login.component.css']
// // // // })
// // // // export class LoginComponent {
// // // //   loginForm: FormGroup;

// // // //   constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<LoginComponent>,
// // // //     private authService: AuthService,userService:UserService
// // // //   ) {
// // // //     this.loginForm = this.fb.group({
// // // //       email: ['', [Validators.required, Validators.email]],
// // // //       password: ['', [Validators.required, Validators.minLength(6)]]
// // // //     });
// // // //   }

// // // //   onSubmit() {
// // // //     if (this.loginForm.valid) {
// // // //       console.log('Login data:', this.loginForm.value);
// // // //       this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
// // // //       this.dialogRef.close();
// // // //     }
// // // //   }
// // // // }
// // // import { Component, inject } from '@angular/core';
// // // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // // import { MatFormFieldModule } from '@angular/material/form-field';
// // // import { MatInputModule } from '@angular/material/input';
// // // import { MatButtonModule } from '@angular/material/button';
// // // import { AuthService } from '../../../services/auth.service';
// // // import { UserService } from '../../../services/user.service';
// // // import { Router } from '@angular/router';

// // // @Component({
// // //   selector: 'app-login',
// // //   standalone: true,
// // //   imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
// // //   templateUrl: './login.component.html',
// // //   styleUrls: ['./login.component.css']
// // // })
// // // export class LoginComponent {
// // //   loginForm: FormGroup;

// // //   constructor(
// // //     private fb: FormBuilder,
// // //     private authService: AuthService,
// // //     private userService: UserService
// // //   ) {
// // //     this.loginForm = this.fb.group({
// // //       email: ['', [Validators.required, Validators.email]],
// // //       password: ['', [Validators.required, Validators.minLength(6)]]
// // //     });
// // //   }  


// // //   onSubmit() {
// // //     if (this.loginForm.valid) {
// // //       console.log('Login data:', this.loginForm.value);
// // //       this.authService.login(
// // //         this.loginForm.value.email,
// // //         this.loginForm.value.password
// // //       );

// // //     router.navigate(['/login']);

// // //     }
// // //   }
// // // }
// // import { Component } from '@angular/core';
// // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { MatFormFieldModule } from '@angular/material/form-field';
// // import { MatInputModule } from '@angular/material/input';
// // import { MatButtonModule } from '@angular/material/button';
// // import { AuthService } from '../../../services/auth.service';
// // import { UserService } from '../../../services/user.service';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [
// //     ReactiveFormsModule,
// //     MatFormFieldModule,
// //     MatInputModule,
// //     MatButtonModule
// //   ],
// //   templateUrl: './login.component.html',
// //   styleUrls: ['./login.component.css']
// // })
// // export class LoginComponent {
// //   loginForm: FormGroup;
// //   error: string = '';

// //   constructor(
// //     private fb: FormBuilder,
// //     private authService: AuthService,
// //     private userService: UserService,
// //     private router: Router
// //   ) {
// //     this.loginForm = this.fb.group({
// //       email: ['', [Validators.required, Validators.email]],
// //       password: ['', [Validators.required, Validators.minLength(6)]]
// //     });
// //   }

// //   onSubmit() {
// //     if (this.loginForm.valid) {
// //       const { email, password } = this.loginForm.value;

// //       this.authService.login(email, password).subscribe({
// //         next: (data) => {
// //           if (data.token) {
// //             sessionStorage.setItem('token', data.token);
// //             sessionStorage.setItem('user', JSON.stringify(data.user));
// //             this.router.navigate(['/dashboard']);
// //           }
// //         },
// //         error: (error) => {
// //           console.error('Login failed', error);
// //           this.error = 'Login failed. Please check your credentials.';
// //         }
// //       });
      
// //     }
// //   }
// // }
// import { Component } from "@angular/core"
// import {  FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { MatFormFieldModule } from "@angular/material/form-field"
// import { MatInputModule } from "@angular/material/input"
// import { MatButtonModule } from "@angular/material/button"
// import { MatIconModule } from "@angular/material/icon"
// import { AuthService } from "../../../services/auth.service"
// import { UserService } from "../../../services/user.service"
// import { Router } from "@angular/router"

// @Component({
//   selector: "app-login",
//   standalone: true,
//   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
//   templateUrl: "./login.component.html",
//   styleUrls: ["./login.component.css"],
// })
// export class LoginComponent {
//   loginForm: FormGroup
//   error = ""
//   hidePassword = true

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private userService: UserService,
//     private router: Router,
//   ) {
//     this.loginForm = this.fb.group({
//       email: ["", [Validators.required, Validators.email]],
//       password: ["", [Validators.required, Validators.minLength(6)]],
//     })
//   }

//   onSubmit() {
//     if (this.loginForm.valid) {
//       const { email, password } = this.loginForm.value

//       // Show loading state
//       this.error = ""

//       this.authService.login(email, password).subscribe({
//         next: (data) => {
//           if (data.token) {
//             sessionStorage.setItem("token", data.token)
//             sessionStorage.setItem("user", JSON.stringify(data.user))
//             this.router.navigate(["/dashboard"])
//           }
//         },
//         error: (error) => {
//           console.error("Login failed", error)
//           this.error = "Login failed. Please check your credentials."
//         },
//       })
//     } else {
//       // Mark all fields as touched to trigger validation messages
//       this.loginForm.markAllAsTouched()
//     }
//   }
// }
import { Component } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { CommonModule } from "@angular/common"
import  { AuthService } from "../../../services/auth.service"
import  { UserService } from "../../../services/user.service"
import  { Router } from "@angular/router"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup
  error = ""
  hidePassword = true

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }
cancel(){
  this.error = ""
  this.hidePassword = true
  this.loginForm.reset()
}
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value

      // Show loading state
      this.error = ""

      this.authService.login(email, password).subscribe({
        next: (data) => {
          if (
            data.user.role.nameRole == "Admin" &&
             data.token) {
            sessionStorage.setItem("token", data.token)
            sessionStorage.setItem("user", JSON.stringify(data.user))
            this.router.navigate(["/dashboard"])
          }
         else {
          this.error = "You are not authorized to access the admin panel."
        }
        },
        error: (error) => {
          console.error("Login failed", error)
          this.error = "Login failed. Please check your credentials."
        },
      })
    } else {
      // Mark all fields as touched to trigger validation messages
      this.loginForm.markAllAsTouched()
    }
  }
}
