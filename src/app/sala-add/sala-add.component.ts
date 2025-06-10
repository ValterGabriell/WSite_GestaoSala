import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sala-add',
  imports: [FormsModule, CommonModule],
  templateUrl: './sala-add.component.html',
  styleUrl: './sala-add.component.css'
})
export class SalaAddComponent {
  name: string = '';
  mensagem: string = '';

  constructor(private http: HttpClient) { }

  criarSala() {
    // Monta o DTO conforme esperado pelo backend
    const dto: { name: string } = { name: this.name };

    this.http.post<string>('http://localhost:5093/api/v1/sala', dto)
      .subscribe({
        next: (res) => this.mensagem = 'Sala criada com sucesso!',
        error: (err) => this.mensagem = 'Erro ao criar sala: ' + (err.error || err.message)
      });
  }
}
