import { Injectable } from '@angular/core';
import { DiaIgrejota, TipoDia } from './diaigrejota';
import { DIASIGREJOTA } from './mock-diasigrejota';
import { CalendarEvent } from 'angular-calendar';
import { AlunosService } from './alunos.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';

class DiaIgrejotaEncapsulator {
  static encapsule(d: DiaIgrejota): any {
    return {id: d.id, dia: d.dia.format("DD-MM-YYYY"), tipo: d.tipo, descricao: d.descricao}
  }

  static decapsule(d: any): DiaIgrejota {
    return {id: d.id, dia: moment(d.dia,"DD-MM-YYYY"), tipo: d.tipo, descricao: d.descricao}
  }
}

@Injectable()
export class DiasigrejotaService {

  diasIgrejota: AngularFireList<DiaIgrejota>
  static loaded: boolean = false;
  constructor(
    private alunosService: AlunosService,
    private messageService: MessageService,
    private db: AngularFireDatabase
    ) {
    this.diasIgrejota = db.list("/dias")
    this.diasIgrejota.valueChanges()
      .subscribe(di => {
        for (let i in di) {
          di[i] = DiaIgrejotaEncapsulator.decapsule(di[i])
        }
        DIASIGREJOTA.length = 0
        DIASIGREJOTA.push(...di)
        DiasigrejotaService.loaded = true
      })
  }

  isReady(): boolean {
    return DiasigrejotaService.loaded
  }

  diaToEvento(dia: DiaIgrejota): CalendarEvent {
    return {
      start: dia.dia.toDate(),
      title: dia.descricao,
      color: { primary: "#"+dia.tipo, secondary: "#"+dia.tipo}
    }
  }

  getEventos(date: Date): Observable<CalendarEvent[]> {
  	var eventosCalendario: CalendarEvent[] = [];
  	for (let evento of DIASIGREJOTA) {
      let event: CalendarEvent = {
        start: evento.dia.toDate(),
        title: evento.descricao,
        color: { primary: "#"+evento.tipo, secondary: "#"+evento.tipo}
      }
	  	eventosCalendario.push(event);
  	}
  	return of(eventosCalendario);
  }

  getDias(mes: Date): Observable<DiaIgrejota[]> {
  	return of(DIASIGREJOTA.filter(data => data.dia.isSame(mes,"month") && data.dia.isSame(mes,"year")));
  }

  getDia(dia: Date): Observable<DiaIgrejota[]> {
  	return of(DIASIGREJOTA.filter(data => data.dia.isSame(dia,"day")));
  }

  add(date: Date) {
    let dia: DiaIgrejota = {id: Math.floor(Date.now() + Math.random()*100), dia: moment(date), descricao: "Evento sem nome", tipo: TipoDia.Normal};
    this.diasIgrejota.set(String(dia.id),DiaIgrejotaEncapsulator.encapsule(dia)).then(_ => {
      DIASIGREJOTA.push(dia);
      this.messageService.add("Evento adicionado com sucesso!");
    })
  }

  edit(evento: DiaIgrejota) {
    let index = DIASIGREJOTA.findIndex(e => e.id === evento.id)
    if (index === -1) {
      return
    }
    let dia = DIASIGREJOTA[index]
    this.diasIgrejota.update(String(evento.id),DiaIgrejotaEncapsulator.encapsule(evento)).then(_ => {
      DIASIGREJOTA[index].dia = evento.dia;
      DIASIGREJOTA[index].tipo = evento.tipo;
      DIASIGREJOTA[index].descricao = evento.descricao;
      this.messageService.add((evento.tipo === TipoDia.Normal ? "Encontro" : "Evento")+" do dia "+evento.dia.format("DD/MM/YYYY")+" editado!");
    })
  }

  remove(evento: DiaIgrejota) {
    let index = DIASIGREJOTA.findIndex(e => e.id === evento.id)
    if (index === -1) {
      return
    }
    let dia = DIASIGREJOTA[index]
    this.diasIgrejota.remove(String(evento.id)).then(_ => {
      console.log(DIASIGREJOTA.splice(index,1));
      this.getDia(evento.dia.toDate())
        .subscribe(eventos => {
          if (eventos.length <= 0) {
            this.alunosService.removePresencasFrom(evento.dia.toDate());
          }
        })
      this.messageService.add("Dia removido do sistema!");
    });
  }
}
