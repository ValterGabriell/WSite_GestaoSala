import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header.component";

enum EnumTurnoTurma {
  MATUTINO = 0,
  VESPERTINO = 1,
  NOTURNO = 2
}

@Component({
  selector: 'app-turma-add',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './turma-add.component.html',
  styleUrl: './turma-add.component.css'
})
export class TurmaAddComponent {
  turno: EnumTurnoTurma = EnumTurnoTurma.MATUTINO;
  bloco: number | null = null;
  nome: string = '';
  isLoading = false;
  mensagem = '';
  mensagemErro = '';

  EnumTurnoTurma = EnumTurnoTurma; // para usar no template

  constructor(private http: HttpClient) { }

  async criarTurma() {
    this.isLoading = true;
    this.mensagem = '';
    this.mensagemErro = '';


    const dto = {
      turno: this.turno,
      bloco: this.bloco,
      nome: this.nome
    };
    try {
      await this.http.post('http://localhost:5093/api/v1/turma', dto, { responseType: 'text' }).toPromise();
      this.mensagem = 'Turma criada com sucesso!';
      this.nome = '';
      this.bloco = null;
      this.turno = EnumTurnoTurma.MATUTINO;
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao criar turma.';
    } finally {
      this.isLoading = false;
    }
  }
}
