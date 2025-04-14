import { Component } from '@angular/core';

@Component({
  selector: 'app-professores',
  imports: [],
  templateUrl: './professores.component.html',
  styleUrl: './professores.component.css'
})
export class ProfessoresComponent {
  meuBooleano = false;

  mockedUsers: IProfessor[] = [
    {
      id: 0,
      isActive: true,
      creationDate: "2025-04-14T16:45:51.341Z",
      lastLogin: "2025-04-14T16:45:51.341Z",
      name: "João Silva",
      mobilePhone: "+55 11 91234-5678",
      email: "joao.silva@email.com",
      username: "joaosilva",
      color: "#FF5733"
    },
    {
      id: 1,
      isActive: false,
      creationDate: "2024-12-20T09:30:00.000Z",
      lastLogin: "2025-01-10T14:12:45.000Z",
      name: "Maria Oliveira",
      mobilePhone: "+55 21 99876-5432",
      email: "maria.oliveira@email.com",
      username: "maria.oliveira",
      color: "#33C1FF"
    },
    {
      id: 2,
      isActive: true,
      creationDate: "2025-03-01T12:00:00.000Z",
      lastLogin: "2025-04-13T17:00:00.000Z",
      name: "Carlos Souza",
      mobilePhone: "+55 31 98765-4321",
      email: "carlos.souza@email.com",
      username: "carlossouza",
      color: "#8E44AD"
    }
  ];

  atualizaBooleano(valor: boolean) {
    this.meuBooleano = valor;
  }



}

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
