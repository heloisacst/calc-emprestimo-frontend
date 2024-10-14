import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaApiService{
  private url = 'http://localhost:8080/calcular';

  constructor(private http: HttpClient) {}

  postDadosEmprestimo(body: String): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.url, body, { headers });
  }

  montarBody(dataInicial: string, dataFinal: string, dataPrimeiroPagamento: string, valorEmprestimo: number, taxaJuros: number) {
     const body = {
        dataInicial: dataInicial,
        dataFinal: dataFinal,
        dataPrimeiroPagamento: dataPrimeiroPagamento,
        valorEmprestimo: valorEmprestimo,
        taxaJuros: taxaJuros
    };

    return JSON.stringify(body);
}
}
