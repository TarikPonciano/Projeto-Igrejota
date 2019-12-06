import { Injectable } from '@angular/core';
import { JOGOS } from './mock-jogos';
import { Jogo } from './jogo';
import { Categoria } from './categoria';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Router } from '@angular/router';

class JogoEncapsulator {
  
  encapsule(jogo: Jogo): any {
    var categorias = {}
    for (let c in jogo.categorias) {
      categorias[c] = { id: jogo.categorias[c].id, nome: jogo.categorias[c].nome}
    }
    return { id: jogo.id, nome: jogo.nome, minJogadores: jogo.minJogadores, maxJogadores: jogo.maxJogadores,
      tempoJogo: jogo.tempoJogo, categorias: categorias, imagemJogo: jogo.imagemJogo, descricao: jogo.descricao,
      linkManual: jogo.linkManual, linkDesenvolvedor: jogo.linkDesenvolvedor, emDestaque: jogo.emDestaque
    }
  }

  decapsule(data: any): Jogo {
    var categorias: Categoria[] = [];
    for (let cat of data.categorias) {
      categorias.push(cat)
    }
    return { id: data.id, nome: data.nome, minJogadores: data.minJogadores, maxJogadores: data.maxJogadores,
      tempoJogo: data.tempoJogo, categorias: categorias, imagemJogo: data.imagemJogo, descricao: data.descricao,
      linkManual: data.linkManual, linkDesenvolvedor: data.linkDesenvolvedor, emDestaque: data.emDestaque
    }
  }
}

@Injectable()
export class JogoService {

  jogos: AngularFireList<Jogo>
  static loaded: boolean = false;
  constructor(
    private messageService: MessageService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private router: Router
    ) {
    this.jogos = db.list<Jogo>("/jogos")
    if (JogoService.loaded) {
      return
    } else {
    this.jogos.valueChanges()
      .subscribe(j => {
        for (let i in j) {
          if (j[i].imagemJogo != "") {
            try {
              let fileRef = this.storage.ref(j[i].imagemJogo)
              if (!fileRef) {
                 j[i].imagemJogo = "capa/default.png"
              }
              this.storage.ref(j[i].imagemJogo).getDownloadURL()
                  .subscribe(imagem => {
                    let index = i
                    j[index].imagemJogo = imagem
                  });
            } catch {
              j[i].imagemJogo = "capa/default.png"
            }
          }
        }
        JOGOS.length = 0
        JOGOS.push(...j)
        JogoService.loaded = true;
      });
    }
  }

  isReady(): boolean {
    return JogoService.loaded
  }

  private checarTempo(tempoDisponivel: number, margem: number, jogo: Jogo): Boolean {
	  return tempoDisponivel >= (jogo.tempoJogo - margem) && tempoDisponivel <= (jogo.tempoJogo + margem);
  }

  private checarJogadores(nJogadores: number, jogo: Jogo): Boolean {
	  return nJogadores >= jogo.minJogadores && nJogadores <= jogo.maxJogadores;
  }

  removeCategoriaFromAll(categoria: Categoria): Observable<Boolean> {
    for (let index in JOGOS) {
      let jogo = JOGOS[index];
      if (!jogo.categorias) {
        jogo.categorias = [];
      }
      if (jogo.categorias.includes(categoria) === true) {
        let indexCategoria = jogo.categorias.indexOf(categoria);
        jogo.categorias.splice(indexCategoria,1);
        this.edit(jogo)
      }
    }
    return of(true)
  }

  getJogos(): Observable<Jogo[]> {
  	return of(JOGOS);
  }

  getJogosEmDestaque(): Observable<Jogo[]> | null {
  	return of(JOGOS.filter(jogo => jogo.emDestaque));
  }

  get(id: number): Observable<Jogo> {
  	return of(JOGOS.find(jogo => jogo.id === id));
  }

  getBuscaJogos(termoBusca: string): Observable<Jogo[]> {
    var jogosEncontrados: Jogo[] = [];
    let termo = termoBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    
    for(let jogo of JOGOS) {
      if (jogo.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(termo)) {
        jogosEncontrados.unshift(jogo);
      } else if (jogo.descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(termo) || jogo.categorias.find(categoria => categoria.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(termo))) {
        jogosEncontrados.push(jogo);
      }
    }

    if (jogosEncontrados.length > 0) {
      this.messageService.add(jogosEncontrados.length +" resultados para '"+termo+"'");
    } else {
      this.messageService.add("Não foram encontrados resultados para '"+termo+"'");
    }
    return of(jogosEncontrados);
  }

  edit(jogo: Jogo): void {
  	let index = JOGOS.indexOf(JOGOS.find(item => item.id === jogo.id));
    this.jogos.update(String(jogo.id),jogo).then(_ => {
      JOGOS[index].nome = jogo.nome;
      JOGOS[index].tempoJogo = jogo.tempoJogo;
      JOGOS[index].minJogadores = jogo.minJogadores;
      JOGOS[index].maxJogadores = jogo.maxJogadores;
      JOGOS[index].categorias = jogo.categorias;
      JOGOS[index].imagemJogo = jogo.imagemJogo;
      JOGOS[index].descricao = jogo.descricao;
      JOGOS[index].linkManual = jogo.linkManual;
      JOGOS[index].linkDesenvolvedor = jogo.linkDesenvolvedor;
      this.router.navigate(['/jogo/'+jogo.id]);
      this.messageService.add("Jogo editado!");
    });
  }

  remove(id: number): void {
  	let index = JOGOS.indexOf(JOGOS.find(jogo => jogo.id === id));
    this.jogos.remove(String(JOGOS[index].id)).then(_ => {
      JOGOS.splice(index, 1);
      this.router.navigate(["/jogos"]);
      this.messageService.add("Jogo deletado!");
    })
  }

  add(jogo: Jogo): void {
    this.jogos.set(String(jogo.id),jogo).then(_ => {
      this.router.navigate(['/jogo/'+jogo.id])
      this.messageService.add("Jogo adicionado!");
    })
  }

  generateEmptyJogo(): Observable<Jogo> {
    return of({id: -1, nome: "", minJogadores: 0, maxJogadores: 0, tempoJogo: 0, categorias: [], descricao: "", imagemJogo: "" ,linkDesenvolvedor: "", linkManual:"", emDestaque: false});
  }

  getJogosSugeridos(nJogadores: number, tempoEscolhido: number, categorias: Categoria[], jogos: Jogo[]): Observable<Jogo[]> {
    var jogosSugeridos: Jogo[] = [];
    if (nJogadores === -1 && tempoEscolhido === -1 && categorias.length <= 0) {
      return of(jogos);
    }

    for (let jogo of jogos) {
    	if (this.checarJogadores(nJogadores, jogo) || nJogadores === -1) {
  			jogosSugeridos.push(jogo);
  		}
    }

    for (let i in jogosSugeridos) {
  		let jogo = jogosSugeridos[i];
  		if (!this.checarTempo(tempoEscolhido, 10, jogo) && tempoEscolhido !== -1) {
  			jogosSugeridos.splice(jogosSugeridos.indexOf(jogo), 1);
  		}
  	}

  	var maxEquivalente: number = 0;

  	if (categorias.length > 0) {
  		for (let i in jogosSugeridos) {
  			let jogo = jogosSugeridos[i];
  			var nEquivalente = 0;
  			for (let categoria of jogo.categorias) {
  				if (categorias.includes(categoria)) {
  					nEquivalente++;
  				}
  			}
  			if (nEquivalente <= 0) {
  				jogosSugeridos.splice(jogosSugeridos.indexOf(jogo),1);
  			} else if (nEquivalente > maxEquivalente) {
  				jogosSugeridos.unshift(jogosSugeridos.splice(jogosSugeridos.indexOf(jogo),1)[0]);
  				maxEquivalente = nEquivalente;
  			}
  		}
  	}

    if (jogosSugeridos.length > 0) {
  	  this.messageService.add("Temos "+jogosSugeridos.length+" sugestões!");
    }
  	return of(jogosSugeridos);
  }

  getJogosPossiveis(nJogadores: number, tempoEscolhido: number, jogos: Jogo[]): Observable<Jogo[]> {
	  var jogosPossiveis: Jogo[] = [];
	  if (nJogadores === -1 && tempoEscolhido === -1) {
      return of(jogos);
    }

  	for (let jogo of jogos) {
  		if (this.checarJogadores(nJogadores, jogo) || nJogadores === -1) {
  			jogosPossiveis.push(jogo);
  		}
  	}

  	for (let i in jogosPossiveis) {
  		let jogo = jogosPossiveis[i];
  		if (!this.checarTempo(tempoEscolhido, 30, jogo) && tempoEscolhido !== -1) {
  			jogosPossiveis.splice(jogosPossiveis.indexOf(jogo), 1);
  		}
  	}
    if (jogosPossiveis.length > 0) {
  	  this.messageService.add(jogosPossiveis.length+" jogos possíveis encontrados!");
    }
  	return of(jogosPossiveis);
  }
}
