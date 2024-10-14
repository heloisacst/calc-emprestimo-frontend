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
  newValorEmprestimo: string = '';
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
      (this.taxaJuros / 100)
    );
    this.newValorEmprestimo = this.formatarValor(this.valorEmprestimo);
    this.buscarDadosEmprestimo(this.body);
  }
      buscarDadosEmprestimo(body: String) {
        this.subscription = this.apiService.postDadosEmprestimo(body).subscribe({
          next: (data: any[]) => {
            this.dados = data.map(item => ({
              ...item,
              dataCompetencia: this.formatarData(item.dataCompetencia),
              saldoDevedor: this.formatarValor(item.saldoDevedor),
              total: this.formatarValor(item.total),
              amortizacao: this.formatarValor(item.amortizacao),
              saldo: this.formatarValor(item.saldo),
              valorProvisao: this.formatarValor(item.valorProvisao),
              valorAcumulado: this.formatarValor(item.valorAcumulado),
              valorPago: this.formatarValor(item.valorPago),
            }));
            this.dadosEmprestimo = this.dados;
          },
          error: (erro) => {
            console.log(erro);
          }
        });
      }

    formatarValor(valor: number): string {
      return valor.toFixed(2).replace('.', ',');
    }

    formatarData(data: string): string {
      const [ano, mes, dia] = data.split('-').map(Number);
      return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`; // Formatar a data para dd/mm/yyyy
    }

  validarDatas(): boolean {
    const [anoInicial, mesInicial, diaInicial] = this.dataInicial.split('-').map(Number);
    const [anoFinal, mesFinal, diaFinal] = this.dataFinal.split('-').map(Number);
    const [anoPrimeiroPagamento, mesPrimeiroPagamento, diaPrimeiroPagamento] = this.dataPrimeiroPagamento.split('-').map(Number);

    const inicial = new Date(anoInicial, mesInicial - 1, diaInicial);
    const final = new Date(anoFinal, mesFinal - 1, diaFinal);
    const primeiroPagamento = new Date(anoPrimeiroPagamento, mesPrimeiroPagamento - 1, diaPrimeiroPagamento);

    if (final <= inicial) {
      this.msgErro = 'A data final deve ser maior que a data inicial.';
      return false;
    }
    if (primeiroPagamento <= inicial || primeiroPagamento >= final) {
      this.msgErro = 'A data de primeiro pagamento deve ser maior que a data inicial e menor que a data final.';
      return false;
    }
    if (
      inicial.getMonth() === primeiroPagamento.getMonth() &&
      inicial.getFullYear() === primeiroPagamento.getFullYear()
    ) {
      this.msgErro = 'A data de primeiro pagamento deve ser posterior ao mês da data inicial.';
      return false;
    }

    this.msgErro = '';
    return true;
  }

  ngOnInit(): void {
    this.dataInicial = '2024-01-01';
    this.dataFinal = '2034-01-01';
    this.valorEmprestimo = 140000;
    this.taxaJuros = 7;
    this.dataPrimeiroPagamento = '2024-02-15';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
