import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, DayCellContentArg, EventApi, EventSourceInput } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { converterParaEventos, IAtribuicoes } from './AtribuicaoHelper';

import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";

export enum GlobalState {
  LOADING = 'LOADING',
  IDLE = 'IDLE',
  ERROR = 'ERROR'
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HeaderComponent],
  templateUrl: './atribuicoes.component.html',
  styleUrls: ['./atribuicoes.component.css']
})



export class AtribuicoesComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  selectedDate: Date | null = null;
  dailyEvents: any[] = [];
  currentState = GlobalState.IDLE;
  atribuicoes: IAtribuicoes[] = [];
  eventosCache: any;
  GlobalState = GlobalState;

  // Inicializa com um array vazio
  calendarOptions: CalendarOptions = {
    timeZone: 'America/Sao_Paulo',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth'
    },
    height: '800px',
    plugins: [timeGridPlugin, dayGridPlugin, listPlugin, multiMonthPlugin, interactionPlugin],
    allDaySlot: false,
    locales: [ptBrLocale],
    locale: 'pt-br',
    events: [],
    selectable: true,
    dateClick: this.handleDateClick.bind(this),
    eventColor: '#4f46e5',
    eventTextColor: '#ffffff',
    eventBorderColor: '#4338ca',
    dayHeaderClassNames: 'custom-day-header',
    dayCellClassNames: (arg: DayCellContentArg) => {
      if (this.selectedDate && this.isSameDay(arg.date, this.selectedDate)) {
        return 'custom-day-cell selected-day';
      }
      return 'custom-day-cell';
    },
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

  irParaAtribuicaoDeSala() {
    this.router.navigate(['/atribuicoes-add']);
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

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }
  async removerAtribuicao(event: any) {


    if (!confirm('Tem certeza que deseja remover esta atribuição?')) return;
    this.currentState = GlobalState.LOADING;
    try {
      // Pegue os parâmetros necessários do evento
      const userId = event.professorId;
      const salaId = event.salaId || event.sala?.id;
      const turmaId = event.turmaId || event.turma?.id;
      // O dia pode estar em event.start ou event.dia
      const dia = event.dia
      console.log(event);

      // Monte a URL com query params
      const url = `http://localhost:5093/api/v1/atribuicoes?userId=${userId}&salaId=${salaId}&turmaId=${turmaId}&dia=${dia}`;

      await firstValueFrom(
        this.http.delete(url)
      );
      window.location.reload();
      if (this.selectedDate) {
        this.handleDateClick({ dateStr: this.selectedDate.toISOString().split('T')[0], date: this.selectedDate } as any);
      }
    } catch (err) {
      alert('Erro ao remover atribuição.');
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  handleDateClick(clickInfo: DateClickArg) {
    const dateParts = clickInfo.dateStr.split('-');
    const date = new Date(
      Number(dateParts[0]), // ano
      Number(dateParts[1]) - 1, // mês (0-indexed)
      Number(dateParts[2]), // dia
      0, 0, 0 // hora, minuto, segundo
    );

    this.selectedDate = date; // Armazena a data selecionada

    const events = this.eventosCache as EventApi[];


    this.dailyEvents = events
      .filter(event => {



        const dateParts_Info = clickInfo.dateStr.split('-');
        const clickInfoDate = new Date(
          Number(dateParts_Info[0]), // ano
          Number(dateParts_Info[1]) - 1, // mês (0-indexed)
          Number(dateParts_Info[2]), // dia
          0, 0, 0 // hora, minuto, segundo
        );

        return this.isSameDay(event.start as Date, clickInfoDate);
      })
      .map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.backgroundColor,
        professor: event.extendedProps['professor'],
        disciplina: event.extendedProps['disciplina'],
        turma: event.extendedProps['turma'],
        sala: event.extendedProps['sala'],
        salaId: event.extendedProps['salaId'],
        turmaId: event.extendedProps['turmaId'],
        turno: event.extendedProps['turno'],
        dia: event.extendedProps['dia'],
        professorId: event.extendedProps['professorId']
      }), 0);

  }

  async ngOnInit() {
    await this.getAtribuições();
  }
}