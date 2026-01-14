import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  Username: string = "";
  Password: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {

  }


  Login() {
    if (!this.Username || !this.Password) {
      this.errorMessage = "Please enter both username and password.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    // if(this.Username=='admin' && this.Password=='admin'){
    //   this.router.navigate(['fdfrontend'])
    // }
    // else{
    //   this.errorMessage='invalid crediential';
    //   this.isLoading = false;
    // }


    this.authService.login(this.Username, this.Password).subscribe({
      next: (data) => {
        this.isLoading = false;

        // Strict check for successful queryStatus from API
        if (data && data.queryStatus === 1) {
          this.router.navigate(['fdfrontend']);
          console.log("Logged in successfully");
        } else {
          // Login failed despite 200 OK from server
          this.errorMessage = (data && data.message) ? data.message : "Invalid credentials. Please try again.";
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Login error", error);
        this.errorMessage = "Login failed. Please check your credentials or network.";
      }
    });
  }

}
