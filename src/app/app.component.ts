import { Component, OnInit, inject } from '@angular/core';
import { BuscaApiService } from '../service/busca-api.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DadosEmprestimo } from '../models/dados-emprestimo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule, HttpClientModule, CommonModule]
})

export class AppComponent implements OnInit{
  title = 'desafio-gesplan';
  subscription: Subscription | undefined;
  dados: any[] = [];
  body: any = '';
  dadosEmprestimo: DadosEmprestimo | any;
  dataInicial: string = '';
  dataFinal: string = '';
  dataPrimeiroPagamento: string = '';
  valorEmprestimo: number = 0;
  taxaJuros: number = 0;
  msgErro: string = '';

  constructor(private apiService: BuscaApiService){}

  calcularEmprestimo() {

    if (!this.validarDatas()) {
      return;
    }

    this.body = this.apiService.montarBody(
      this.dataInicial,
      this.dataFinal,
      this.dataPrimeiroPagamento,
      this.valorEmprestimo,
      this.taxaJuros
    );
    console.log(this.body);
    this.buscarDadosEmprestimo(this.body);
  }

  buscarDadosEmprestimo(body: String) {
      this.subscription = this.apiService.postDadosEmprestimo(body).subscribe(
          {
            next: (data: any[]) => {
                this.dados = data;
                this.dadosEmprestimo = data;
            },
            error: (erro) => {
                    console.log(erro)
            }
        }
      );
      console.log(this.dados);
  }

  validarDatas(): boolean {
    const inicial = new Date(this.dataInicial);
    const final = new Date(this.dataFinal);
    const primeiroPagamento = new Date(this.dataPrimeiroPagamento);

    if (final <= inicial) {
        this.msgErro = 'A data final deve ser maior que a data inicial.';
        return false;
    }
    if (primeiroPagamento <= inicial || primeiroPagamento >= final) {
        this.msgErro = 'A data de primeiro pagamento deve ser maior que a data inicial e menor que a data final.';
        return false;
    }

    this.msgErro= '';
    return true;
  }

  ngOnInit(): void {
    this.dataInicial = '2024-01-01';
    this.dataFinal = '2034-01-01';
    this.valorEmprestimo = 140000;
    this.taxaJuros = 0.07;
    this.dataPrimeiroPagamento = '2024-02-15';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
