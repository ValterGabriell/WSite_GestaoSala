import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'; // Para cliques e drag-and-drop
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { atribuicoes, converterParaEventos } from './mockData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './atribuicoes.component.html',
  styleUrls: ['./atribuicoes.component.css']
})
export class AtribuicoesComponent {
  title = 'angular17';
  selectedDate: Date | null = null;
  dailyEvents: any[] = [];

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  handleDateClick(clickInfo: DateClickArg) {
    console.log(clickInfo);

    this.selectedDate = clickInfo.date;

    const calendarApi = clickInfo.view.calendar;
    const events = calendarApi.getEvents();

    this.dailyEvents = events
      .filter(event => this.isSameDay(event.start as Date, clickInfo.date))
      .map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.backgroundColor, // ou event.color dependendo do que foi definido
        professor: event.extendedProps['professor'],
        disciplina: event.extendedProps['disciplina'],
        turma: event.extendedProps['turma'],
        sala: event.extendedProps['sala'],
        turno: event.extendedProps['turno']
      }));
  }

  ngOnInit() {

  };
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: '800px',
    plugins: [timeGridPlugin, dayGridPlugin, listPlugin, multiMonthPlugin, interactionPlugin],
    allDaySlot: false,
    locales: [ptBrLocale],
    locale: 'pt-br',
    events: converterParaEventos(atribuicoes),
    dateClick: this.handleDateClick.bind(this),
    // Estilização via options
    eventColor: '#4f46e5',
    eventTextColor: '#ffffff',
    eventBorderColor: '#4338ca',
    dayHeaderClassNames: 'custom-day-header',
    dayCellClassNames: 'custom-day-cell',
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
}