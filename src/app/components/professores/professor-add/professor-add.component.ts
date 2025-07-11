import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
    selector: 'app-professor-add',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderComponent],
    templateUrl: './professor-add.component.html',
    styleUrls: ['./professor-add.component.css']
})
export class ProfessorAddComponent {
    professorForm: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.professorForm = this.fb.group({
            name: ['', Validators.required],
            mobilePhone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            color: ['#000000', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            isActive: [true]
        });
    }
    loading = false;
    onSubmit() {
        if (this.professorForm.valid) {
            this.loading = true;
            this.http.post(
                'http://localhost:5093/api/v1/professor',
                this.professorForm.value,
                { responseType: 'text' }
            ).subscribe({
                next: (res) => {
                    this.successMessage = res || 'Professor cadastrado com sucesso!';
                    this.errorMessage = '';
                    this.professorForm.reset({ isActive: true, color: '#000000' });
                    this.loading = false;
                },
                error: () => {
                    this.errorMessage = 'Erro ao cadastrar professor.';
                    this.successMessage = '';
                    this.loading = false;
                }
            });
        }
    }
}