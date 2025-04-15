import { Component, inject, Injectable } from '@angular/core';
import { GlobalState } from '../../util/GlobalState';
import { GlobalResponse } from '../../util/IGlobalResponse';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  imports: [],
  templateUrl: './disciplinas.component.html',
  styleUrl: './disciplinas.component.css'
})
@Injectable({ providedIn: 'root' })
export class DisciplinasComponent {
  private http = inject(HttpClient);

  currentState = GlobalState.IDLE;
  listaDisciplina: GlobalResponse<IDisciplina[]> = {} as GlobalResponse<IDisciplina[]>;

  async getDisciplinas() {
    try {
      this.currentState = GlobalState.LOADING;

      const data = await firstValueFrom(this.http.get<IDisciplina[]>('http://localhost:5093/api/v1/disciplina'));

      this.listaDisciplina = {
        success: true,
        message: 'Disciplina carregados com sucesso',
        data: data,
      }
    } catch (error) {
      this.listaDisciplina = {
        success: false,
        message: 'Erro ao carregar Disciplina',
        data: [],
        error: (error as Error).message,
      };
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  ngOnInit() {
    this.getDisciplinas();
  }
}
