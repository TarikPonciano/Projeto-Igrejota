import { Component, OnInit } from '@angular/core';
import { Aluno } from '../aluno';
import { Presenca } from '../presenca';
import { AuthService } from '../auth.service';
import { AlunosService } from '../alunos.service';
import { DiasigrejotaService } from '../diasigrejota.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-dia-presenca',
  templateUrl: './dia-presenca.component.html',
  styleUrls: ['./dia-presenca.component.css']
})

export class DiaPresencaComponent implements OnInit {
  selectedDay: moment.Moment;
  alunosDiaIgrejota: Presenca[] = [];

  constructor(
  	public auth: AuthService,
  	private router: Router,
  	private route: ActivatedRoute,
  	private alunosService: AlunosService,
  	private diasIgrejotaService: DiasigrejotaService
  	) {

  }

  ngOnInit() {
  	let date = this.route.snapshot.paramMap.get("data");
  	this.selectedDay = moment(date, "DD-MM-YYYY");
  	this.getAlunos();
  }

  getAlunos() {
  	this.alunosService.getPresencas(this.selectedDay.toDate())
  		.subscribe(alunos => this.alunosDiaIgrejota = alunos);
    this.alunosDiaIgrejota.sort((a,b) => {
      if (a.aluno.nome > b.aluno.nome) {
          return 1;
        }

        if (a.aluno.nome < b.aluno.nome) {
          return -1;
        }
    })
  }

  adicionarPresenca() {
  	this.router.navigate(['calendario/add/'+this.selectedDay.format("DD-MM-YYYY")]);
  }

  remover(presenca: Presenca) {
  	this.alunosService.removePresenca(presenca.aluno,presenca.diaPresenca.toDate());
  	this.getAlunos()
  }
}
