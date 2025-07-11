import { Routes } from '@angular/router';
import { ProfessoresComponent } from './components/professores/professores.component';
import { DisciplinasComponent } from './components/disciplinas/disciplinas.component';
import { AtribuicoesComponent } from './components/atribuicoes/atribuicoes.component';
import { SalasComponent } from './components/salas/salas.component';
import { AtribuicoesAddComponent } from './components/atribuicoes-add/atribuicoes-add.component';
import { SalaAddComponent } from './sala-add/sala-add.component';
import { TurmaAddComponent } from './turma-add/turma-add.component';
import { TurmasComponent } from './turmas/turmas.component';
import { ProfessorAddComponent } from './components/professores/professor-add/professor-add.component';
import { DisciplinaAddComponent } from './disciplina-create/disciplina-create.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './AuthGuard';

export const routes: Routes = [
    {
        path: "",
        component: AtribuicoesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "professores",
        component: ProfessoresComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "professores-add",
        component: ProfessorAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "login",
        component: LoginComponent,
        data: { title: 'Login' }
    },
    {
        path: "disciplina-create",
        component: DisciplinaAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "atribuicoes",
        component: AtribuicoesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "salas",
        component: SalasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "salas-add",
        component: SalaAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "turmas-add",
        component: TurmaAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "turmas",
        component: TurmasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "disciplinas",
        component: DisciplinasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "atribuicoes-add",
        component: AtribuicoesAddComponent,
        canActivate: [AuthGuard]
    }
];
