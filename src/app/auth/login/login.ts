import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Log } from '../../log';
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

  constructor(private router: Router, public log: Log, private authService: AuthService) {

  }


  Login() {
    if (!this.Username || !this.Password) {
      this.errorMessage = "Please enter both username and password.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.login(this.Username, this.Password).subscribe({
      next: (data) => {
        this.isLoading = false;

        if (data && data.status === 'ERROR') { // Example check, adjust based on actual API
          this.errorMessage = data.message || "Login failed.";
          this.log.loggedin = false; // Revert if service set it blindly
        } else {
          this.router.navigate(['dashboard']);
          console.log("Logged in successfully");
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
