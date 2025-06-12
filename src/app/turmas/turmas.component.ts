import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Turma {
  id: string;
  turno: number | string; // pode vir como string ou número
  bloco: number;
  nome: string;
}

@Component({
  selector: 'app-turmas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './turmas.component.html',
  styleUrl: './turmas.component.css'
})
export class TurmasComponent {
  turmas: Turma[] = [];
  search: string = '';
  isLoading = false;
  mensagem = '';
  mensagemErro = '';
  editTurma: Turma | null = null;
  loadingAction = false;

  EnumTurnoTurma = [
    { value: 0, label: 'Matutino' },
    { value: 1, label: 'Vespertino' },
    { value: 2, label: 'Noturno' }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getTurmas();
  }

  async getTurmas() {
    this.isLoading = true;
    this.mensagem = '';
    this.mensagemErro = '';
    try {
      const data = await this.http.get<Turma[]>('http://localhost:5093/api/v1/turma').toPromise();
      this.turmas = data ?? [];
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao carregar turmas.';
    } finally {
      this.isLoading = false;
    }
  }

  get turmasFiltradas(): Turma[] {
    const termo = this.search.trim().toLowerCase();
    if (!termo) return this.turmas;
    return this.turmas.filter(t =>
      t.nome.toLowerCase().includes(termo) ||
      t.bloco.toString().includes(termo) ||
      this.getTurnoLabel(t.turno).toLowerCase().includes(termo)
    );
  }

  getTurnoLabel(turno: number | string): string {
    // Se vier como número ou string numérica
    if (turno === 0 || turno === '0') return 'Matutino';
    if (turno === 1 || turno === '1') return 'Vespertino';
    if (turno === 2 || turno === '2') return 'Noturno';

    // Se vier como texto
    if (typeof turno === 'string') {
      const t = turno.toUpperCase();
      if (t === 'MATUTINO') return 'Matutino';
      if (t === 'VESPERTINO') return 'Vespertino';
      if (t === 'NOTURNO') return 'Noturno';
    }
    return '';
  }

  abrirEdicao(turma: Turma) {
    let turnoNum = turma.turno;
    if (typeof turnoNum === 'string' && !isNaN(Number(turnoNum))) {
      turnoNum = parseInt(turnoNum, 10);
    } else if (typeof turnoNum === 'string') {
      // Se vier como texto, converte para número
      if (turnoNum.toUpperCase() === 'MATUTINO') turnoNum = 0;
      else if (turnoNum.toUpperCase() === 'VESPERTINO') turnoNum = 1;
      else if (turnoNum.toUpperCase() === 'NOTURNO') turnoNum = 2;
    }
    this.editTurma = { ...turma, turno: turnoNum };
  }

  cancelarEdicao() {
    this.editTurma = null;
  }

  async salvarEdicao() {
    if (!this.editTurma) return;
    this.loadingAction = true;
    this.mensagem = '';
    this.mensagemErro = '';
    const dto = {
      nome: this.editTurma.nome,
      bloco: this.editTurma.bloco,
      turno: typeof this.editTurma.turno === 'string' ? parseInt(this.editTurma.turno, 10) : this.editTurma.turno
    };
    try {
      await this.http.put(`http://localhost:5093/api/v1/turma/${this.editTurma.id}`, dto, { responseType: 'text' }).toPromise();
      this.mensagem = 'Turma editada com sucesso!';
      this.editTurma = null;
      await this.getTurmas();
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao editar turma.';
    } finally {
      this.loadingAction = false;
    }
  }

  async excluirTurma(turma: Turma) {
    if (!confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?`)) return;
    this.loadingAction = true;
    this.mensagem = '';
    this.mensagemErro = '';
    try {
      await this.http.delete(`http://localhost:5093/api/v1/turma/${turma.id}`, { responseType: 'text' }).toPromise();
      this.mensagem = 'Turma excluída com sucesso!';
      await this.getTurmas();
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao excluir turma.';
    } finally {
      this.loadingAction = false;
    }
  }
}
