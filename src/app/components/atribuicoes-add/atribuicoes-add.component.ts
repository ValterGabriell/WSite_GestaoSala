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

@Component({
  selector: 'app-atribuicoes-add',
  imports: [ReactiveFormsModule, CalendarModule, CommonModule, FullCalendarModule],
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
  //@ts-ignore
  atribuirAulaForm: FormGroup;
  currentState = GlobalState.IDLE;
  atribuicoes: IAtribuicoes[] = [];

  professors = [
    { id: 1, label: 'Professor A' },
    { id: 2, label: 'Professor B' },
    { id: 18, label: 'valter' },
    { id: 3, label: 'Professor C' }
  ];
  salas = [
    { id: 12, label: 'Sala Valter' },
    { id: 1, label: 'Sala 101' },
    { id: 2, label: 'Sala 102' },
    { id: 3, label: 'Sala 103' }
  ];
  disciplinas = [
    { id: 1, label: 'Matemática' },
    { id: 2, label: 'História' },
    { id: 3, label: 'Geografia' },
    { id: 4, label: 'FILOSOFIA DAS CIENCIAS' }
  ];
  turmas = [
    { id: 1, label: 'Turma A' },
    { id: 2, label: 'Turma B' },
    { id: '00000000-0000-0000-0000-000000000000', label: 'EC 2019,4' },
    { id: 3, label: 'Turma C' }
  ];

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
        this.http.get<IAtribuicoes[]>('http://localhost:5093/api/v1/atribuicoes')
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


  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  }

  submitForm() {
    this.currentState = GlobalState.LOADING;
    const formData = {
      ...this.atribuirAulaForm.value,
      diasSelecionados: this.diasSelecionadosParaAtribuicao
    };


    //@ts-ignore
    formData.diasSelecionados.forEach((dia) => {
      const atribuirAula: IPostAtribuicao = {
        userId: formData.professorId,
        salaId: formData.salaId,
        disciplinaId: formData.disciplinaId,
        turmaID: formData.turmaId,
        diaDeAulaDaSemana: dia,
        horaInicial: formData.startTime,
        horaFinal: formData.endTime
      };
      console.log('Dados do formulário:', atribuirAula);
      this.http.post<IPostAtribuicao>('http://localhost:5093/api/v1/atribuicoes', atribuirAula).subscribe(() => {
        this.currentState = GlobalState.IDLE;
      });
    })

    // // const atribuirAula: IPostAtribuicao = {
    // //   userId: this.atribuirAulaForm.value.professorId,
    // //   salaId: this.atribuirAulaForm.value.salaId,
    // //   disciplinaId: this.atribuirAulaForm.value.disciplinaId;
    // //   turmaID: this.atribuirAulaForm.value.turmaId,
    // //   diaDeAulaDaSemana: ;
    // //   horaInicial: number;
    // //   horaFinal: number;
    // // }


  }

  async ngOnInit() {
    await this.getAtribuições();
    this.atribuirAulaForm = new FormGroup({
      professorId: new FormControl(this.professors.length ? this.professors[0].id : null),
      salaId: new FormControl(this.salas.length ? this.salas[0].id : null),
      disciplinaId: new FormControl(this.disciplinas.length ? this.disciplinas[0].id : null),
      turmaId: new FormControl(this.turmas.length ? this.turmas[0].id : null),
      selectedDays: new FormControl([]),  // Selecione os dias conforme necessário
      startTime: new FormControl(''),
      endTime: new FormControl('')
    });
  }

}
