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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
interface ICombo {
  id: string | number,
  label: string
}
export enum GlobalState {
  LOADING = 'LOADING',
  IDLE = 'IDLE',
  ERROR = 'ERROR'
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, HeaderComponent],
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
  usuario: any = null;
  showEditModal = false;
  editAtribuicaoForm!: FormGroup;
  editAtribuicaoContext: any = null;
  comboDisciplina: ICombo[] = {} as ICombo[];
  comboProfessores: ICombo[] = {} as ICombo[];
  comboTurma: ICombo[] = {} as ICombo[];
  comboSala: ICombo[] = {} as ICombo[];


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

  abrirEditModal(event: any) {
    this.editAtribuicaoContext = event;
    this.editAtribuicaoForm = new FormBuilder().group({
      userId: [event.professorId, Validators.required],
      salaId: [event.salaId, Validators.required],
      turmaId: [event.turmaId, Validators.required],
      horaInicial: [event.start ? new Date(event.start).getHours() : '', Validators.required],
      horaFinal: [event.end ? new Date(event.end).getHours() : '', Validators.required],
      diaCorrente: [event.dia || (event.start ? event.start.toISOString().split('T')[0] : ''), Validators.required]
    });
    this.showEditModal = true;
  }

  fecharEditModal() {
    this.showEditModal = false;
    this.editAtribuicaoContext = null;
  }

  //combos
  async getProfessores() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<ICombo[]>('http://localhost:5093/api/v1/professor/combo'));
      this.comboProfessores = data;
    } catch (error) {
      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }

  async getDisciplinas() {
    try {
      this.currentState = GlobalState.LOADING;
      const data = await firstValueFrom(this.http.get<ICombo[]>('http://localhost:5093/api/v1/disciplina/combo'));
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
      const data = await firstValueFrom(this.http.get<ICombo[]>('http://localhost:5093/api/v1/turma/combo'));
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
      const data = await firstValueFrom(this.http.get<ICombo[]>('http://localhost:5093/api/v1/sala/combo'));
      this.comboSala = data;
    } catch (error) {
      this.currentState = GlobalState.ERROR;
    } finally {
      this.currentState = GlobalState.IDLE;
    }
  }



  async salvarEdicaoAtribuicao() {
    if (this.editAtribuicaoForm.invalid) return;
    this.currentState = GlobalState.LOADING;
    const dto = this.editAtribuicaoForm.value;
    const salaId = this.editAtribuicaoContext.salaId;
    const oldUserId = this.editAtribuicaoContext.professorId;

    try {
      await firstValueFrom(
        this.http.put(
          `http://localhost:5093/api/v1/atribuicoes?salaId=${salaId}&oldUserId=${oldUserId}`,
          dto,
          { responseType: 'text' }
        )
      );
      this.fecharEditModal();
      window.location.reload();
    } catch (err) {
      alert('Erro ao editar atribuição.');
    } finally {
      this.currentState = GlobalState.IDLE;
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

        console.log(event);


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
        //@ts-ignore
        color: event.color,
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

    await this.getDisciplinas();
    await this.getProfessores();
    await this.getSalas();
    await this.getTurmas();



    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuario = typeof usuarioStr === 'string' ? JSON.parse(usuarioStr) : usuarioStr;
      } catch {
        this.usuario = usuarioStr;
      }
    }
  }
}