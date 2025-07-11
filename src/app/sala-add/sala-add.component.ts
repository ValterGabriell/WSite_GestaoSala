import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-sala-add',
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './sala-add.component.html',
  styleUrl: './sala-add.component.css'
})
export class SalaAddComponent {
  name: string = '';
  mensagem: string = '';
  loading: boolean = false;
  constructor(private http: HttpClient) { }

  criarSala() {
    this.loading = true;
    // Monta o DTO conforme esperado pelo backend
    const dto: { name: string } = { name: this.name };

    this.http.post<string>('http://localhost:5093/api/v1/sala', dto)
      .subscribe({
        next: (res) => {
          this.mensagem = 'Sala criada com sucesso!';
          this.loading = false;
        },
        error: (err) => {
          this.mensagem = 'Erro ao criar sala';
          this.loading = false;
        }
      });
  }
}
