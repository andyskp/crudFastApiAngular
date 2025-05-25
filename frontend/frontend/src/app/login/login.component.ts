import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://127.0.0.1:8000/login', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.router.navigate(['/todo']);
      },
      error: (err) => {
        this.error = 'Credenciales inválidas';
      }
    });
  }
}
