
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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
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
// cancel(){
//   this.error = ""
//   this.hidePassword = true
//   this.loginForm.reset()
// }
//   onSubmit() {
//     if (this.loginForm.valid) {
//       const { email, password } = this.loginForm.value

//       // Show loading state
//       this.error = ""

//       this.authService.login(email, password).subscribe({
//         next: (data) => {
//           if (
//             data.user.role.nameRole == "Admin" &&
//              data.token) {
//             sessionStorage.setItem("token", data.token)
//             sessionStorage.setItem("user", JSON.stringify(data.user))
//             this.router.navigate(["/dashboard"])
//           }
//          else {
//           this.error = "You are not authorized to access the admin panel."
//         }
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
export class LoginComponent {
  loginForm: FormGroup;
  error = "";
  hidePassword = true;
  isLoading = false; // הוספת משתנה חדש לסימון מצב טעינה

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  cancel() {
    this.error = "";
    this.hidePassword = true;
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // הצגת מצב טעינה
      this.isLoading = true;
      this.error = "";

      this.authService.login(email, password).subscribe({
        next: (data) => {
          this.isLoading = false; // הסרת מצב טעינה לאחר סיום
          if (data.user.role.nameRole == "Admin" && data.token) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            this.router.navigate(["/dashboard"]);
          } else {
            this.error = "You are not authorized to access the admin panel.";
          }
        },
        error: (error) => {
          this.isLoading = false; // הסרת מצב טעינה במקרה של שגיאה
          console.error("Login failed", error);
          this.error = "Login failed. Please check your credentials.";
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
    }
  }
}
