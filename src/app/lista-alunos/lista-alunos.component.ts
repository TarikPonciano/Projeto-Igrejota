import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlunosService } from '../alunos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Aluno } from '../aluno';
import * as moment from 'moment';

@Component({
  selector: 'app-lista-alunos',
  templateUrl: './lista-alunos.component.html',
  styleUrls: ['./lista-alunos.component.css']
})
export class ListaAlunosComponent implements OnInit {
  date: moment.Moment
  termoBusca: string;
  listaAlunos: Aluno[] = [];
  listaEdicao: Aluno[] = [];
  listaMostrados: Aluno[] = [];
  listaSelecionados: Aluno[] = [];
  showFormNovoAluno: boolean;
  novoAluno: Aluno = {matricula: undefined, nome: undefined};

  constructor(
  	public auth: AuthService,
  	private alunosService: AlunosService,
  	private router: Router,
  	private route: ActivatedRoute
  	) {

  }

  ngOnInit() {
  	this.date = moment(this.route.snapshot.paramMap.get("data"),"DD-MM-YYYY")
  	this.getAlunos()
  	this.listaMostrados = this.listaAlunos
  }

  getAlunos() {
  	this.alunosService.getAlunosSemPresenca(this.date.toDate())
  		.subscribe(alunos => this.listaAlunos = alunos)
  	this.listaAlunos.sort((a,b) => {
      if (a.nome > b.nome) {
          return 1;
        }

        if (a.nome < b.nome) {
          return -1;
        }
    })
  }

  adicionarPresencas() {
  	for (let aluno of this.listaSelecionados) {
  		this.alunosService.addPresenca(aluno,this.auth.getLoggedUser(),this.date.toDate())
  	}
  	this.listaSelecionados = []
  	this.router.navigate(['calendario/'+this.date.format("DD-MM-YYYY")])
  }

  alunoChecado(aluno: Aluno): Boolean {
  	return this.listaSelecionados.includes(aluno)
  }

  alunoEmEdicao(aluno: Aluno): Boolean {
  	return this.listaEdicao.includes(aluno)
  }

  addAluno(aluno: Aluno, lista: Aluno[]): void {
  	lista.push(aluno);
  }

  removeAluno(aluno: Aluno, lista: Aluno[]): void {
  	let index = lista.indexOf(aluno);
  	lista.splice(index,1);
  }

  toggleAluno(aluno: Aluno): void {
  	this.listaSelecionados.includes(aluno) ? this.removeAluno(aluno, this.listaSelecionados) : this.addAluno(aluno, this.listaSelecionados);
  }

  toggleEditAluno(aluno: Aluno) {
  	this.listaEdicao.includes(aluno) ? this.removeAluno(aluno, this.listaEdicao) : this.addAluno(aluno, this.listaEdicao);
  }

  search() {
  	this.listaMostrados = this.listaAlunos.filter(a => a.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.termoBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")));
  }

  cadastrar() {
  	let aluno: Aluno = {matricula: this.novoAluno.matricula, nome: this.novoAluno.nome}
  	this.alunosService.add(aluno);
  	this.novoAluno = {matricula: undefined, nome: undefined};
  	this.showFormNovoAluno = false;
  	this.getAlunos();
  	this.listaMostrados = this.listaAlunos
  }
}
