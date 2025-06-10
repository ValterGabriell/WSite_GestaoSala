import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface DtoGetSala {
  id: number;
  isActive: boolean;
  creationDate: string;
  name: string;
}

@Component({
  selector: 'app-salas',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})
export class SalasComponent {
  salas: DtoGetSala[] = [];
  search: string = '';
  isActive: string = '';
  mensagem: string = '';
  loading: boolean = false;

  // Controle de edição
  editId: number | null = null;
  editName: string = '';

  constructor(private http: HttpClient) {
    this.buscarSalas();
  }

  buscarSalas() {
    this.loading = true;
    let params = new HttpParams();
    if (this.search) params = params.set('Search', this.search);
    if (this.isActive !== '') params = params.set('IsActive', this.isActive);

    this.http.get<DtoGetSala[]>('http://localhost:5093/api/v1/sala', { params })
      .subscribe({
        next: (res) => {
          this.salas = res;
          this.mensagem = this.salas.length === 0 ? 'Nenhuma sala encontrada.' : '';
          this.loading = false;
        },
        error: (err) => {
          this.mensagem = 'Erro ao buscar salas: ' + (err.error || err.message);
          this.salas = [];
          this.loading = false;
        }
      });
  }

  editarSala(sala: DtoGetSala) {
    this.editId = sala.id;
    this.editName = sala.name;
  }

  cancelarEdicao() {
    this.editId = null;
    this.editName = '';
  }

  salvarEdicao(sala: DtoGetSala) {
    const dto = { name: this.editName };
    this.loading = true;
    this.http.put(`http://localhost:5093/api/v1/sala/${sala.id}`, dto)
      .subscribe({
        next: () => {
          sala.name = this.editName;
          this.editId = null;
          this.editName = '';
          this.loading = false;
        },
        error: (err) => {
          this.mensagem = 'Erro ao editar sala: ' + (err.error || err.message);
          this.loading = false;
        }
      });
  }

  excluirSala(sala: DtoGetSala) {
    const dto = { name: this.editName };
    this.loading = true;
    this.http.delete(`http://localhost:5093/api/v1/sala/${sala.id}`)
      .subscribe({
        next: () => {
          sala.name = this.editName;
          this.editId = null;
          this.editName = '';
          this.loading = false;
        },
        error: (err) => {
          this.mensagem = 'Erro ao editar sala: ' + (err.error || err.message);
          this.loading = false;
        }
      });
  }
}
