import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  user = { name: '', email: '', password: '' };
  message = '';
  isLoading = false;


  constructor(private registerService: RegisterService,  private router: Router) {}

  register() {
    console.log('Registering user:', this.user);

    this.isLoading = true;
    this.registerService.registerUser(this.user).subscribe({
      next: (data) => {
        console.log(data)
        this.isLoading = false;
        this.message = 'Inscription réussie !';
        document.cookie = "token="+data.token;
        setTimeout(() => { 
          this.router.navigate(['/login']);
        })
      },
      error: (err) => {
        console.error('Erreur POST', err)
        this.isLoading = false;
        if (err.status === 400) {
          this.message = 'Validation error : ' + (err.error.message || 'Please check your input.');
        } else if (err.status === 409) {
          this.message = 'Email already used. Please choose another one.';
        }
      }
    });
    
  }
}
