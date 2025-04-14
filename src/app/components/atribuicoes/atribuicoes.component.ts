import { Component } from '@angular/core';
import { CalendarModule } from 'angular-calendar';

@Component({
  selector: 'app-atribuicoes',
  imports: [CalendarModule],
  templateUrl: './atribuicoes.component.html',
  styleUrl: './atribuicoes.component.css'
})
export class AtribuicoesComponent {
  atribuicoes = [
    {
      dia: "2025-04-14",
      salas: [
        {
          salaId: 1,
          horaInit: 8,
          horaFinal: 10,
          tblSala: { id: 101, isActive: true, creationDate: "2025-04-14", name: "Sala A1" },
          professor: {
            id: 201, name: "Ana Souza", email: "ana@escola.com", color: "#FF5733", isActive: true,
            creationDate: "2025-04-14", lastLogin: "2025-04-14", mobilePhone: "", username: "", password: "", isAdmin: "true"
          },
          disciplina: { id: 301, nome: "Matemática", codigo: "MAT101", sigla: "MAT", cargaHoraria: 60, totalAulas: 40 },
          turma: { id: "1A", turno: "Manhã", bloco: 1, nome: "1º Ano A" }
        },
        {
          salaId: 2,
          horaInit: 10,
          horaFinal: 12,
          tblSala: { id: 102, isActive: true, creationDate: "2025-04-14", name: "Sala B2" },
          professor: {
            id: 202, name: "Carlos Lima", email: "carlos@escola.com", color: "#33A8FF", isActive: true,
            creationDate: "2025-04-14", lastLogin: "2025-04-14", mobilePhone: "", username: "", password: "", isAdmin: "false"
          },
          disciplina: { id: 302, nome: "História", codigo: "HIS201", sigla: "HIS", cargaHoraria: 60, totalAulas: 40 },
          turma: { id: "1B", turno: "Manhã", bloco: 2, nome: "1º Ano B" }
        }
      ]
    },
    {
      dia: "2025-04-15",
      salas: [
        {
          salaId: 3,
          horaInit: 9,
          horaFinal: 11,
          tblSala: { id: 103, isActive: true, creationDate: "2025-04-15", name: "Sala C3" },
          professor: {
            id: 203, name: "Beatriz Mendes", email: "bea@escola.com", color: "#8E44AD", isActive: true,
            creationDate: "2025-04-15", lastLogin: "2025-04-15", mobilePhone: "", username: "", password: "", isAdmin: "false"
          },
          disciplina: { id: 303, nome: "Geografia", codigo: "GEO301", sigla: "GEO", cargaHoraria: 60, totalAulas: 40 },
          turma: { id: "2A", turno: "Manhã", bloco: 1, nome: "2º Ano A" }
        },
        {
          salaId: 4,
          horaInit: 14,
          horaFinal: 17,
          tblSala: { id: 104, isActive: true, creationDate: "2025-04-15", name: "Sala D4" },
          professor: {
            id: 204, name: "Diego Rocha", email: "diego@escola.com", color: "#27AE60", isActive: true,
            creationDate: "2025-04-15", lastLogin: "2025-04-15", mobilePhone: "", username: "", password: "", isAdmin: "true"
          },
          disciplina: { id: 304, nome: "Química", codigo: "QUI401", sigla: "QUI", cargaHoraria: 60, totalAulas: 40 },
          turma: { id: "3A", turno: "Tarde", bloco: 3, nome: "3º Ano A" }
        }
      ]
    },
    {
      dia: "2025-04-16",
      salas: [
        {
          salaId: 5,
          horaInit: 7,
          horaFinal: 9,
          tblSala: { id: 105, isActive: true, creationDate: "2025-04-16", name: "Sala E5" },
          professor: {
            id: 205, name: "Fernanda Lopes", email: "fer@escola.com", color: "#E67E22", isActive: true,
            creationDate: "2025-04-16", lastLogin: "2025-04-16", mobilePhone: "", username: "", password: "", isAdmin: "true"
          },
          disciplina: { id: 305, nome: "Física", codigo: "FIS501", sigla: "FIS", cargaHoraria: 60, totalAulas: 40 },
          turma: { id: "2B", turno: "Manhã", bloco: 2, nome: "2º Ano B" }
        }
      ]
    }
  ];

  horas = Array.from({ length: 12 }, (_, i) => i + 7); // 7h às 18h
}