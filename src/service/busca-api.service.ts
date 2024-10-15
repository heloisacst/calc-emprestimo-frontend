import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BuscaApiService{
  private url = 'http://localhost:8080/calcular';

  constructor(private http: HttpClient) {}

  postDadosEmprestimo(body: String): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.url, body, { headers }).pipe(
      catchError(this.gerenciarErros)
    );
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

  private gerenciarErros(erro: HttpErrorResponse) {
    let msgErro = 'Erro desconhecido';

    if (erro.error instanceof ErrorEvent) {
      msgErro = `Erro: ${erro.error.message}`;
    } else {
      if (erro.error && erro.error.message) {
        msgErro = erro.error.message;
      } else if (typeof erro.error === 'string') {
        msgErro = erro.error;
      } else {
        msgErro = `Erro ${erro.status}: ${erro.statusText}`;
      }
    }

    console.error('Erro capturado:', erro);
    return throwError(() => msgErro);
  }
}
