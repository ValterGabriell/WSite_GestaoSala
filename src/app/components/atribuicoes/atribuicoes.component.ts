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
import { GlobalState } from '../../util/GlobalState';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
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
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  handleDateClick(clickInfo: DateClickArg) {
    const date = clickInfo.date;
    this.selectedDate = date; // Armazena a data selecionada

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const events = this.eventosCache as EventApi[];

    this.dailyEvents = events
      .filter(event => this.isSameDay(event.start as Date, clickInfo.date))
      .map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.backgroundColor,
        professor: event.extendedProps['professor'],
        disciplina: event.extendedProps['disciplina'],
        turma: event.extendedProps['turma'],
        sala: event.extendedProps['sala'],
        turno: event.extendedProps['turno'],
        professorId: event.extendedProps['professorId']
      }), 0);

  }

  async ngOnInit() {
    await this.getAtribuições();
  }
}