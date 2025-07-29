import { EventInput, EventSourceInput } from "@fullcalendar/core/index.js";

export interface IAtribuicoes {
    dia: string;
    salas: Sala[];
}

interface Sala {
    salaId: number;
    horaInit: number;
    horaFinal: number;
    tblSala: TblSala;
    professor: Professor;
    disciplina: Disciplina;
    turma: Turma;
}

interface Turma {
    id: string;
    turno: string;
    bloco: number;
    nome: string;
}

interface Disciplina {
    id: number;
    nome: string;
    codigo: string;
    sigla: string;
    cargaHoraria: number;
    totalAulas: number;
}

interface Professor {
    id: number;
    name: string;
    email: string;
    color: string;
    isActive: boolean;
    creationDate: string;
    lastLogin: string;
    mobilePhone: string;
    username: string;
    password: string;
    isAdmin: string;
}

interface TblSala {
    id: number;
    isActive: boolean;
    creationDate: string;
    name: string;
}

export interface IPostAtribuicao {
    userId: number;
    salaId: number;
    disciplinaId: number;
    turmaID: string;
    diaDeAulaDaSemana: string;
    horaInicial: number;
    horaFinal: number;
}


export function converterParaEventos(atribuicoes: IAtribuicoes[]): EventSourceInput {
    return atribuicoes.flatMap(dia => {
        return dia.salas.map(sala => {
            // Correção: força data local
            const start = parseDateLocal(dia.dia, sala.horaInit);
            const end = parseDateLocal(dia.dia, sala.horaFinal);

            return {
                id: `sala-${sala.salaId}-${dia.dia}`,
                title: `${sala.disciplina.sigla}`,
                start: start,
                end: end,
                color: sala.professor.color,
                extendedProps: {
                    professor: sala.professor.name,
                    sala: sala.tblSala.name,
                    disciplina: sala.disciplina.nome,
                    turma: sala.turma.nome,
                    turno: sala.turma.turno,
                    bloco: sala.turma.bloco,
                    salaId: sala.salaId,
                    professorId: sala.professor.id,
                    disciplinaId: sala.disciplina.id,
                    turmaId: sala.turma.id,
                    dia: dia.dia,
                    horaInit: sala.horaInit,
                    horaFinal: sala.horaFinal
                }
            } as EventInput;
        });
    });
}

// Adicione essa função no mesmo arquivo:
function parseDateLocal(dateStr: string, hora: number): Date {
    const [year, month, day] = dateStr.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day), hora, 0, 0);
}