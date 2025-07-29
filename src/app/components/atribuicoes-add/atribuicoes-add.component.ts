import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DayCellContentArg } from '@fullcalendar/core/index.js';
import { CalendarModule, CalendarView } from 'angular-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { GlobalState } from '../../util/GlobalState';
import { converterParaEventos, IAtribuicoes, IPostAtribuicao } from '../atribuicoes/AtribuicaoHelper';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { GlobalResponse } from '../../util/IGlobalResponse';
import { IProfessor } from '../professores/professores.component';
import { HeaderComponent } from "../../shared/header/header.component";


interface ICombo {
  id: string,
  label: string
}

@Component({
  selector: 'app-atribuicoes-add',
  imports: [ReactiveFormsModule, CalendarModule, CommonModule, FullCalendarModule, HeaderComponent],
  templateUrl: './atribuicoes-add.component.html',
  styleUrls: ['./atribuicoes-add.component.css']
})
export class AtribuicoesAddComponent implements OnInit {
  private http = inject(HttpClient);
  @ViewChild('calendar') calendar!: FullCalendarComponent;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  diasSelecionadosParaAtribuicao: string[] = [];
  name = new FormControl('');
  eventosCache: any;

  comboDisciplina: ICombo[] = [];         // CORRETO
  comboProfessores: ICombo[] = [];
  comboTurma: ICombo[] = [];
  comboSala: ICombo[] = [];
  atribuirAulaForm!: FormGroup;

  currentState = GlobalState.IDLE;
  atribuicoes: IAtribuicoes[] = [];
  gs = GlobalState;
  mensagem: string = '';
  erros: string[] = [];


  daysOfWeek = [
    { id: 1, label: 'Segunda-feira' },
    { id: 2, label: 'Terça-feira' },
    { id: 3, label: 'Quarta-feira' },
    { id: 4, label: 'Quinta-feira' },
    { id: 5, label: 'Sexta-feira' },
    { id: 6, label: 'Sábado' },
    { id: 7, label: 'Domingo' }
  ];

  // Inicializa com um array vazio
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    },
    height: '400px',
    aspectRatio: 0.5,
    plugins: [timeGridPlugin, dayGridPlugin, listPlugin, multiMonthPlugin, interactionPlugin],
    allDaySlot: false,
    locale: 'pt-br',
    events: [],
    selectable: true,
    dateClick: this.handleDateClick.bind(this),
    dayCellClassNames: (arg: DayCellContentArg) => {
      const dateStr = this.formatDate(arg.date);
      return this.diasSelecionadosParaAtribuicao.includes(dateStr)
        ? 'day-selected'
        : '';
    },
    eventColor: '#4f46e5',
    eventTextColor: '#ffffff',
    eventBorderColor: '#4338ca',
    dayHeaderClassNames: 'custom-day-header',

    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista',
      multiMonthYear: 'Grid Ano',
    },
    buttonIcons: {
      prev: 'chevron-left',
      next: 'chevron-right',
    },
    firstDay: 1,
    themeSystem: 'standard',
  };



  handleDateClick(arg: DateClickArg) {
    const dateStr = this.formatDate(arg.date);

    // Verifica se a data já está selecionada
    const index = this.diasSelecionadosParaAtribuicao.indexOf(dateStr);

    if (index >= 0) {
      // Remove a data se já estiver selecionada
      this.diasSelecionadosParaAtribuicao.splice(index, 1);
    } else {
      // Adiciona a data se não tiver atingido o limite de 7
      if (this.diasSelecionadosParaAtribuicao.length < 7) {
        this.diasSelecionadosParaAtribuicao.push(dateStr);
      } else {
        alert('Máximo de 7 dias selecionados atingido!');
        return;
      }
    }

    this.calendar.getApi().render();

    this.diasSelecionadosParaAtribuicao.sort();
  }


  limparSelecoes() {
    this.diasSelecionadosParaAtribuicao = [];
    this.calendar.getApi().render();
  }


  isDateSelected(date: Date): boolean {
    return this.diasSelecionadosParaAtribuicao.includes(this.formatDate(date));
  }


  getSelectedDates(): Date[] {
    return this.diasSelecionadosParaAtribuicao.map(dateStr => new Date(dateStr));
  }

  toggleDaySelection(date: Date): void {
    this.mensagem = '';
    this.erros = [];
    const dateString = this.formatDate(date);
    const index = this.diasSelecionadosParaAtribuicao.indexOf(dateString);

    if (index === -1) {
      this.diasSelecionadosParaAtribuicao.push(dateString);  // Adiciona a data ao array
    } else {
      this.diasSelecionadosParaAtribuicao.splice(index, 1);  // Remove a data do array
    }
  }

  async getAtribuições() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(
        this.http.get<IAtribuicoes[]>('https://wapi-sistema-gestao-salas.onrender.com/api/v1/atribuicoes')
      );
      this.atribuicoes = data;

      this.calendarOptions.events = converterParaEventos(this.atribuicoes);
      this.eventosCache = this.calendarOptions.events;
    } catch (error) {

      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  //combos
  async getProfessores() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<ICombo[]>('https://wapi-sistema-gestao-salas.onrender.com/api/v1/professor/combo'));
      this.comboProfessores = data.map(p => ({
        id: String(p.id), // converte sempre para string
        label: p.label
      }));
    } catch (error) {
      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  async getDisciplinas() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<ICombo[]>('https://wapi-sistema-gestao-salas.onrender.com/api/v1/disciplina/combo'));
      this.comboDisciplina = data;
    } catch (error) {
      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  async getTurmas() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<ICombo[]>('https://wapi-sistema-gestao-salas.onrender.com/api/v1/turma/combo'));
      this.comboTurma = data;
    } catch (error) {
      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }


  async getSalas() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<ICombo[]>('https://wapi-sistema-gestao-salas.onrender.com/api/v1/sala/combo'));
      this.comboSala = data;
    } catch (error) {
      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }


  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  }


  onProfessorChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    console.log('Professor selecionado:', value);
    // Se quiser o objeto completo:
    const professor = this.comboProfessores.find(p => p.id == value);
    console.log('Professor objeto:', professor);
  }

  async submitForm() {
    this.mensagem = '';
    this.erros = [];
    this.currentState = GlobalState.LOADING;

    this.mensagem = '';
    this.erros = [];
    if (this.diasSelecionadosParaAtribuicao.length === 0) {
      this.mensagem = 'Nenhum dia selecionado para atribuição.';
      this.erros.push('Selecione pelo menos um dia para atribuir a aula.');
      this.currentState = GlobalState.IDLE;
      return;
    }

    const formData = {
      ...this.atribuirAulaForm.value,
      diasSelecionados: this.diasSelecionadosParaAtribuicao
    };

    let errosTemp: string[] = [];
    let sucesso = false;

    for (const dia of formData.diasSelecionados) {
      const atribuirAula: IPostAtribuicao = {
        userId: formData.userId, // <-- agora pega o valor correto
        salaId: formData.salaId,
        disciplinaId: formData.disciplinaId,
        turmaID: formData.turmaId,
        diaDeAulaDaSemana: dia,
        horaInicial: formData.startTime,
        horaFinal: formData.endTime
      };

      console.log(this.atribuirAulaForm.value)
      try {
        const resp: any = await firstValueFrom(
          this.http.post('https://wapi-sistema-gestao-salas.onrender.com/api/v1/atribuicoes', atribuirAula)
        );
        // Se a resposta tem errors e não está vazia
        if (resp.errors && resp.errors.length > 0) {
          errosTemp.push(...resp.errors);
        } else {
          sucesso = true;

        }
      } catch (err: any) {
        // Se a API retorna erro 400 com corpo contendo errors
        if (err.error && err.error.errors) {
          errosTemp.push(...err.error.errors);
        } else {
          errosTemp.push('Erro inesperado ao salvar atribuição.');
        }
      }
    }

    this.currentState = GlobalState.IDLE;

    if (errosTemp.length === 0) {
      this.mensagem = 'Entidade gerada!';
      window.location.reload();
    } else {
      this.erros = errosTemp;
      this.mensagem = 'Nem todas as atribuições puderam ser salvas';
    }
  }
  initForm() {
    this.atribuirAulaForm = new FormGroup({
      userId: new FormControl(this.comboProfessores.length ? this.comboProfessores[0].id : null),
      salaId: new FormControl(this.comboSala.length ? this.comboSala[0].id : null),
      disciplinaId: new FormControl(this.comboDisciplina.length ? this.comboDisciplina[0].id : null),
      turmaId: new FormControl(this.comboTurma.length ? this.comboTurma[0].id : null),
      selectedDays: new FormControl([]),
      startTime: new FormControl(''),
      endTime: new FormControl('')
    });
  }
  async ngOnInit() {
    await this.getAtribuições();
    await this.getDisciplinas();
    await this.getProfessores();
    await this.getSalas();
    await this.getTurmas();
    this.initForm(); // Inicialize o formulário após combos carregados!
  }

}
