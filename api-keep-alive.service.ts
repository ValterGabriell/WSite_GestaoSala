import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiKeepAliveService {
    private url = 'https://wapi-sistema-gestao-salas.onrender.com/api/v1/atribuicoes/imhere';
    private interval = 30000; // 30 segundos

    constructor(private http: HttpClient) {
        setInterval(() => {
            this.http.get(this.url).subscribe({
                next: (response) => {
                    console.log('Keep-alive ping sent:', response);
                },
                error: (err) => {
                    console.error('Keep-alive ping failed:', err);
                }
            });
        }, this.interval);
    }
}