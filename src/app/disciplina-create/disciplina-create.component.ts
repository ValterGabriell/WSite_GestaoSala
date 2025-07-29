import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-disciplina-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './disciplina-create.component.html',
  styleUrl: './disciplina-create.component.css'
})
export class DisciplinaAddComponent {
  disciplinaForm: FormGroup;
  mensagem: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.disciplinaForm = this.fb.group({
      nome: ['', Validators.required],
      codigo: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHoraria: [0, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.disciplinaForm.valid) {
      this.loading = true;
      this.http.post('https://wapi-sistema-gestao-salas.onrender.com/api/v1/disciplina', this.disciplinaForm.value, { responseType: 'text' })
        .subscribe({
          next: (res) => {
            this.mensagem = res || 'Disciplina criada com sucesso!';
            this.disciplinaForm.reset({ cargaHoraria: 0 });
            this.loading = false;
          },
          error: (err) => {
            this.mensagem = 'Erro ao criar disciplina: ' + (err.error || err.message);
            this.loading = false;
          }
        });
    }
  }
}