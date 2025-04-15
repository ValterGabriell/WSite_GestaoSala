import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalState } from '../../util/GlobalState';
import { firstValueFrom } from 'rxjs';
import { GlobalResponse } from '../../util/IGlobalResponse';

interface IProfessor {
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
  imports: [],
  templateUrl: './professores.component.html',
  styleUrl: './professores.component.css'
})
@Injectable({ providedIn: 'root' })
export class ProfessoresComponent {
  private http = inject(HttpClient);

  currentState = GlobalState.IDLE;
  listaProfessores: GlobalResponse<IProfessor[]> = {} as GlobalResponse<IProfessor[]>;

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
      console.log(data);


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
}

