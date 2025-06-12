import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalState } from '../../util/GlobalState';
import { firstValueFrom } from 'rxjs';
import { GlobalResponse } from '../../util/IGlobalResponse';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface IProfessor {
  id: number;
  isActive: boolean;
  creationDate: string;
  lastLogin: string;
  name: string;
  mobilePhone: string;
  email: string;
  username: string;
  color: string;
}

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './professores.component.html',
  styleUrl: './professores.component.css'
})
@Injectable({ providedIn: 'root' })
export class ProfessoresComponent {
  private http = inject(HttpClient);

  currentState = GlobalState.IDLE;
  listaProfessores: GlobalResponse<IProfessor[]> = {} as GlobalResponse<IProfessor[]>;
  editProfessor: IProfessor | null = null;
  loadingAction = false;
  mensagem = '';
  mensagemErro = '';

  async getProfessores() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<IProfessor[]>('http://localhost:5093/api/v1/professor', {
        params: {
          Search: '',
          IsActive: true,
          PageNumber: 1,
          PageSize: 50
        }
      }));

      this.listaProfessores = {
        success: true,
        message: 'Professores carregados com sucesso',
        data: data,
      }
    } catch (error) {
      this.listaProfessores = {
        success: false,
        message: 'Erro ao carregar professores',
        data: [],
        error: (error as Error).message,
      };
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  ngOnInit() {
    this.getProfessores();
  }

  abrirEdicao(professor: IProfessor) {
    this.editProfessor = { ...professor };
    this.mensagem = '';
    this.mensagemErro = '';
  }

  cancelarEdicao() {
    this.editProfessor = null;
  }

  async salvarEdicao() {
    if (!this.editProfessor) return;
    this.loadingAction = true;
    this.mensagem = '';
    this.mensagemErro = '';
    const dto = {
      name: this.editProfessor.name,
      mobilePhone: this.editProfessor.mobilePhone,
      email: this.editProfessor.email,
      color: this.editProfessor.color,
      username: this.editProfessor.username,
      isActive: this.editProfessor.isActive
    };
    try {
      await firstValueFrom(
        this.http.put(`http://localhost:5093/api/v1/professor/${this.editProfessor.id}`, dto, { responseType: 'text' })
      );
      this.mensagem = 'Professor atualizado com sucesso!';
      this.editProfessor = null;
      await this.getProfessores();
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao editar professor.';
    } finally {
      this.loadingAction = false;
    }
  }

  async excluirProfessor(professor: IProfessor) {
    if (!confirm(`Tem certeza que deseja excluir o professor "${professor.name}"?`)) return;
    this.loadingAction = true;
    this.mensagem = '';
    this.mensagemErro = '';
    try {
      await firstValueFrom(
        this.http.delete(`http://localhost:5093/api/v1/professor/${professor.id}`, { responseType: 'text' })
      );
      this.mensagem = 'Professor excluído com sucesso!';
      await this.getProfessores();
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao excluir professor.';
    } finally {
      this.loadingAction = false;
    }
  }
}
