import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { AuthService } from './AuthService';
import { ApiKeepAliveService } from '../../api-keep-alive.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router, private apiKeepAlive: ApiKeepAliveService) {
    setInterval(() => {
      console.log('Verificando token...');
      console.log(auth);

      if (!this.auth.isTokenValid()) {
        this.auth.clearAuth();
        this.router.navigate(['/login']);
      }
    }, 10000); // verifica a cada 10 segundos
  }
  title = 'WSite_GestaoSala';
}
