import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Log } from '../../log';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  Username:string = "";
  Password:string = "";

  constructor( private router: Router,public log: Log) {
    
  }
 

  Login(){
    if ((this.Username=="Admin") && (this.Password=="admin")){
      this.router.navigate (['dashboard']) ;
      this.log.loggedin = true;
      console.log(this.log.loggedin);
    }
    
    
  }

}
