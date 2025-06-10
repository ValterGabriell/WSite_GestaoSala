import { Routes } from '@angular/router';
import { ProfessoresComponent } from './components/professores/professores.component';
import { DisciplinasComponent } from './components/disciplinas/disciplinas.component';
import { AtribuicoesComponent } from './components/atribuicoes/atribuicoes.component';
import { SalasComponent } from './components/salas/salas.component';
import { AtribuicoesAddComponent } from './components/atribuicoes-add/atribuicoes-add.component';
import { SalaAddComponent } from './sala-add/sala-add.component';

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
        path: "disciplinas",
        component: DisciplinasComponent
    },
    {
        path: "atribuicoes-add",
        component: AtribuicoesAddComponent
    }
];
