import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../AuthService';
export class Usuario {
  id!: number;
  isActive!: boolean;
  creationDate!: string;
  lastLogin!: string | null;
  color!: string | null;
  email!: string;
  isAdmin!: boolean | null;
  mobilePhone!: string;
  name!: string;
  password!: string;
  username!: string;

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  mensagem: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.http.post<{ token: string, usuario: Usuario }>(
        'https://wapi-sistema-gestao-salas.onrender.com/api/v1/auth/admin',
        this.loginForm.value
      ).subscribe({
        next: (res) => {
          //@ts-ignore
          this.authService.setAuth(res);
          // Salve o token no localStorage ou sessionStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', res.usuario ? JSON.stringify(res.usuario) : '');
          this.mensagem = '';
          this.loading = false;
          // Redirecione para a tela principal
          this.router.navigate(['/atribuicoes']);
        },
        error: (err) => {
          this.mensagem = 'Usuário ou senha inválidos';
          this.loading = false;
        }
      });
    }
  }

  async ngOnInit() {
    localStorage.setItem('token', '');
    localStorage.setItem('usuario', '');
  }
}