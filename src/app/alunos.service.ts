import { Injectable } from '@angular/core';
import { Bolsista } from './bolsista';
import { Aluno } from './aluno';
import { ALUNOS } from './mock-alunos';
import { Presenca } from './presenca';
import { PRESENCAS } from './mock-presencas';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DiasigrejotaService } from './diasigrejota.service';
import { MessageService } from './message.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';

class PresencaEncapsulator {
  static encapsule(p: Presenca): any {
    return {aluno: JSON.stringify(p.aluno), bolsista: p.bolsista, diaPresenca: p.diaPresenca.format()}
  }

  static decapsule(p: any): Presenca {
    return {aluno: JSON.parse(p.aluno), bolsista: p.bolsista, diaPresenca: moment(p.diaPresenca)}
  }
}

@Injectable({
  providedIn: 'root'
})
export class AlunosService {
  alunos: AngularFireList<Aluno>
  presencas: AngularFireList<Presenca>
  static loadedAlunos: boolean = false;
  static loadedPresencas: boolean = false;
  constructor(
    private messageService: MessageService,
    private db: AngularFireDatabase) {
    this.alunos = db.list<Aluno>('/alunos');
    this.alunos.valueChanges()
      .subscribe(a => {
        ALUNOS.length = 0
        ALUNOS.push(...a)
        AlunosService.loadedAlunos = true;
      })
    this.presencas = db.list<Presenca>('/presencas');
    this.presencas.valueChanges()
      .subscribe(p => {
        for (let i in p) {
          p[i] = PresencaEncapsulator.decapsule(p[i])
        }
        PRESENCAS.length = 0
        PRESENCAS.push(...p)
        AlunosService.loadedPresencas = true
      });
  }

  isReady(): boolean {
    return AlunosService.loadedAlunos && AlunosService.loadedPresencas
  }

  getAlunosCadastrados(): Observable<Aluno[]> {
  	return of(ALUNOS);
  }

  getAlunosSemPresenca(dia: Date): Observable<Aluno[]> {
    let p = PRESENCAS.filter(presenca => presenca.diaPresenca.isSame(dia, "day"))
    var alunos: Aluno[] = []
    for (let aluno of ALUNOS) {
      if (p.findIndex(p => p.aluno.matricula === aluno.matricula) === -1) {
        alunos.push(aluno)
      }
    }
    return of(alunos)
  }

  getPresencas(dia: Date): Observable<Presenca[]> {
  	return of(PRESENCAS.filter(presenca => presenca.diaPresenca.isSame(dia, "day")));
  }

  addPresenca(aluno: Aluno, bolsista: string, dia: Date) {
  	let p: Presenca = {aluno: aluno, bolsista: bolsista, diaPresenca: moment(dia)} ;
    this.presencas.set(String(p.aluno.matricula+" "+p.diaPresenca.format()),PresencaEncapsulator.encapsule(p)).then(_ => {
      PRESENCAS.push(p);
      this.messageService.clear();
      this.messageService.add("Presença adicionada com sucesso!");
    });
  }

  removePresenca(aluno: Aluno, dia: Date) {
  	let index = PRESENCAS.findIndex(presenca => presenca.aluno === aluno && presenca.diaPresenca.isSame(dia, "day"));
    let presenca = PRESENCAS[index];
    this.presencas.remove(String(presenca.aluno.matricula+" "+presenca.diaPresenca.format())).then(_ => {
      PRESENCAS.splice(index, 1);
      this.messageService.clear();
      this.messageService.add("Presença removida!");
    })
  }

  add(aluno: Aluno) {
  	ALUNOS.push(aluno);
    this.alunos.set(String(aluno.matricula),aluno).then(_ => 
        this.messageService.add("Aluno cadastrado!")
      );
  }

  edit(aluno: Aluno) {
  	let index = ALUNOS.findIndex(a => a.matricula === aluno.matricula);
    this.alunos.update(String(aluno.matricula),aluno).then(_ => 
        this.messageService.add("Aluno editado!")
      );
  }

  remove(matricula: number) {
  	let index = ALUNOS.findIndex(a => a.matricula === matricula);
    this.alunos.remove(String(matricula)).then(_ => {
  	  this.removePresencasOf(ALUNOS.splice(index, 1)[0]);
      this.messageService.add("Aluno removido do sistema!");
    })
  }

  removePresencasOf(aluno: Aluno) {
  	for (let presenca of PRESENCAS.filter(presenca => presenca.aluno.matricula === aluno.matricula)) {
  		let index = PRESENCAS.indexOf(PRESENCAS.find(a => a.aluno.matricula === presenca.aluno.matricula));
      let presenca = PRESENCAS[index]
      this.presencas.remove(String(presenca.aluno.matricula+" "+presenca.diaPresenca.format())).then(_ => 
          PRESENCAS.splice(index, 1)
        );
  	}
  }

  removePresencasFrom(day: Date) {
  	this.getPresencas(day)
  		.subscribe(presencas => {
  			for (let p of presencas) {
  				let index = PRESENCAS.findIndex(p => p.diaPresenca.isSame(day,"day"))
          let p = PRESENCAS[0]
          this.presencas.remove(String(p.aluno.matricula+" "+p.diaPresenca.format())).then(_ => 
              PRESENCAS.splice(index,1)
            )
  			}
  		});

  }
}
