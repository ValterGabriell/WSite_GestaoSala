import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfessoresComponent } from './components/professores/professores.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProfessoresComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WSite_GestaoSala';
}
