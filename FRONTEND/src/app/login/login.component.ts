import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = { email: '', password: '' };
    message = '';
    isLoading = false;
  
  
    constructor(private loginService: LoginService,  private router: Router) {}

  login() {
    console.log('log user:', this.user);


    this.isLoading = true;
    this.loginService.loginUser(this.user).subscribe({
      next: (data) => {
        console.log(data)
        this.isLoading = false;
        this.message = 'Login successful!';
        document.cookie = "token="+data.token;
        setTimeout(() => { 
          this.router.navigate(['/list']);
        })
      },
      error: (err) => {
        console.error('Erreur POST', err)
        this.isLoading = false;
        if (err.status === 400) {
          this.message = 'Validation error : ' + (err.error.message || 'Please check your input.');
        } else if (err.status === 409) {
          this.message = 'Email already used. Please choose another one.';
        }else{
          this.message = err.error.message;
        }
      }
    });
    
  }
}
