import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalState } from '../../util/GlobalState';
import { firstValueFrom } from 'rxjs';
import { GlobalResponse } from '../../util/IGlobalResponse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




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
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './professores.component.html',
  styleUrl: './professores.component.css'
})
@Injectable({ providedIn: 'root' })
export class ProfessoresComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);




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


  editandoId: number | null = null;
  edicaoForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobilePhone: [''],
    isActive: [true]
  });

  abrirEdicao(prof: IProfessor) {
    this.editandoId = prof.id;
    this.edicaoForm.setValue({
      name: prof.name,
      username: prof.username,
      email: prof.email,
      mobilePhone: prof.mobilePhone,
      isActive: prof.isActive
    });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.edicaoForm.reset();
  }

  async salvarEdicao(prof: IProfessor) {
    if (this.edicaoForm.invalid) return;
    this.loadingAction = true;
    try {
      const body = {
        ...this.edicaoForm.value
      };

      console.log(body);


      await firstValueFrom(
        this.http.put(`http://localhost:5093/api/v1/professor/${prof.id}`, body, { responseType: 'text' })
      );
      this.mensagem = 'Professor atualizado com sucesso!';
      this.editandoId = null;
      await this.getProfessores();
    } catch (err: any) {
      this.mensagemErro = err?.error || err?.message || 'Erro ao atualizar professor.';
    } finally {
      this.loadingAction = false;
    }
  }

  filtroNome: string = '';

  get listaFiltrada() {
    if (!this.listaProfessores?.data) return [];
    if (!this.filtroNome?.trim()) return this.listaProfessores.data;
    return this.listaProfessores.data.filter((prof: any) =>
      prof.name.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
  }

  ngOnInit() {
    this.getProfessores();
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
