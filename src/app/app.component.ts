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
    this.dadosEmprestimo = null;
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
            this.msgErro = '';
          },
          error: (erro) => {
            this.msgErro = erro;
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

  habilitaBotao() {
    if(!this.dataInicial || !this.dataFinal || !this.dataPrimeiroPagamento || !this.taxaJuros || !this.valorEmprestimo) {
      return false;
    } else {
      return true;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
