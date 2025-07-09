import { Component, inject, Injectable } from '@angular/core';
import { GlobalState } from '../../util/GlobalState';
import { GlobalResponse } from '../../util/IGlobalResponse';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface IDisciplina {
  id: number;
  nome: string;
  codigo: string;
  sigla: string;
  cargaHoraria: number;
  totalAulas: number;
}

@Component({
  selector: 'app-disciplinas',
  imports: [FormsModule, RouterModule],
  templateUrl: './disciplinas.component.html',
  styleUrl: './disciplinas.component.css'
})
@Injectable({ providedIn: 'root' })
export class DisciplinasComponent {
  private http = inject(HttpClient);
  public GlobalState = GlobalState;
  currentState = GlobalState.IDLE;
  listaDisciplina: GlobalResponse<IDisciplina[]> = {} as GlobalResponse<IDisciplina[]>;
  search: string = '';
  // Controle de edição
  editDisciplina: IDisciplina | null = null;
  loadingAction: boolean = false;

  async getDisciplinas() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<IDisciplina[]>('http://localhost:5093/api/v1/disciplina'));
      this.listaDisciplina = {
        success: true,
        message: 'Disciplinas carregadas com sucesso',
        data: data,
      }
    } catch (error) {
      this.listaDisciplina = {
        success: false,
        message: 'Erro ao carregar Disciplinas',
        data: [],
        error: (error as Error).message,
      };
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  get disciplinasFiltradas(): IDisciplina[] {
    if (!this.listaDisciplina.data) return [];
    const termo = this.search.trim().toLowerCase();
    if (!termo) return this.listaDisciplina.data;
    return this.listaDisciplina.data.filter(d =>
      d.nome.toLowerCase().includes(termo) ||
      d.codigo.toLowerCase().includes(termo) ||
      d.sigla.toLowerCase().includes(termo)
    );
  }

  ngOnInit() {
    this.getDisciplinas();
  }

  abrirEdicao(disciplina: IDisciplina) {
    this.editDisciplina = { ...disciplina };
  }

  cancelarEdicao() {
    this.editDisciplina = null;
  }

  async salvarEdicao() {
    if (!this.editDisciplina) return;
    this.loadingAction = true;
    const dto = {
      nome: this.editDisciplina.nome,
      codigo: this.editDisciplina.codigo,
      sigla: this.editDisciplina.sigla,
      cargaHoraria: this.editDisciplina.cargaHoraria
    };
    try {
      await firstValueFrom(
        this.http.put(`http://localhost:5093/api/v1/disciplina?id=${this.editDisciplina.id}`, dto)
      );

      this.editDisciplina = null;
    } catch (err: any) {
      await this.getDisciplinas();
      this.editDisciplina = null;
    } finally {
      await this.getDisciplinas();
      this.loadingAction = false;
      this.editDisciplina = null;
    }
  }

  async excluirDisciplina(disciplina: IDisciplina) {
    if (!confirm(`Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?`)) return;
    this.loadingAction = true;
    try {
      await firstValueFrom(
        this.http.delete(`http://localhost:5093/api/v1/disciplina/${disciplina.id}`)
      );

    } catch (err: any) {
      alert('Erro ao excluir disciplina: ' + (err.error || err.message));
    } finally {
      await this.getDisciplinas();
      this.loadingAction = false;
    }
  }
}
