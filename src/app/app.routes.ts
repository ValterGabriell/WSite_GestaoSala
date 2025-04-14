import { Routes } from '@angular/router';
import { ProfessoresComponent } from './components/professores/professores.component';
import { AtribuicoesComponent } from './components/atribuicoes/atribuicoes.component';

export const routes: Routes = [
    {
        path: "",
        component: ProfessoresComponent
    },
    {
        path: "atribuicoes",
        component: AtribuicoesComponent
    }
];
