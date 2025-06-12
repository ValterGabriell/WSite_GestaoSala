import { Routes } from '@angular/router';
import { ProfessoresComponent } from './components/professores/professores.component';
import { DisciplinasComponent } from './components/disciplinas/disciplinas.component';
import { AtribuicoesComponent } from './components/atribuicoes/atribuicoes.component';
import { SalasComponent } from './components/salas/salas.component';
import { AtribuicoesAddComponent } from './components/atribuicoes-add/atribuicoes-add.component';
import { SalaAddComponent } from './sala-add/sala-add.component';
import { TurmaAddComponent } from './turma-add/turma-add.component';
import { TurmasComponent } from './turmas/turmas.component';

export const routes: Routes = [
    {
        path: "professores",
        component: ProfessoresComponent
    },
    {
        path: "atribuicoes",
        component: AtribuicoesComponent
    },
    {
        path: "salas",
        component: SalasComponent
    },
    {
        path: "salas-add",
        component: SalaAddComponent
    },
    {
        path: "turmas-add",
        component: TurmaAddComponent
    },
    {
        path: "turmas",
        component: TurmasComponent
    },
    {
        path: "disciplinas",
        component: DisciplinasComponent
    },
    {
        path: "atribuicoes-add",
        component: AtribuicoesAddComponent
    }
];
