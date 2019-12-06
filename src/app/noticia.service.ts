import { Injectable } from '@angular/core';
import { NOTICIAS } from './mock-noticia';
import { Noticia } from './noticia';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Router } from "@angular/router";
import * as moment from 'moment';

class NoticiaEncapsulator {
  static encapsule(n: Noticia): any {
    return {id: n.id, titulo: n.titulo, conteudo: n.conteudo, dataCriacao: n.dataCriacao.format("YYYYMMDD, hh:mm:ss"), dataEdicao: n.dataEdicao.format("YYYYMMDD, hh:mm:ss"),imagemDestaque: n.imagemDestaque}
  }

  static decapsule(n: any): Noticia {
    return {id: n.id, titulo: n.titulo, conteudo: n.conteudo, dataCriacao: moment(n.dataCriacao,"YYYYMMDD, hh:mm:ss"),dataEdicao: moment(n.dataEdicao,"YYYYMMDD, hh:mm:ss"),imagemDestaque: n.imagemDestaque}
  }
}

@Injectable()
export class NoticiaService {

  noticias: AngularFireList<Noticia>
  static loaded: boolean = false;
  constructor(
    private messageService: MessageService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private router: Router
    ) {
    this.noticias = db.list<Noticia>("/noticias")
    if (NoticiaService.loaded) {
      return
    } else {
      this.noticias.valueChanges()
        .subscribe(n => {
          for (let i in n) {
            n[i] = NoticiaEncapsulator.decapsule(n[i])
            if (n[i].imagemDestaque != "") {
              try {
                let fileRef = this.storage.ref(n[i].imagemDestaque)
                if (!fileRef) {
                   n[i].imagemDestaque = "capa/default.png"
                }
                this.storage.ref(n[i].imagemDestaque).getDownloadURL()
                    .subscribe(imagem => {
                      let index = i
                      n[index].imagemDestaque = imagem
                    });
              } catch {
                n[i].imagemDestaque = "capa/default.png"
              }
            }
          }
          NOTICIAS.length = 0
          NOTICIAS.push(...n)
          NoticiaService.loaded = true
        })
    }
  }

  isReady(): boolean {
    return NoticiaService.loaded
  }

  getNoticias(): Observable<Noticia[]> {
  	return of(NOTICIAS);
  }

  getUltimaNoticia(): Observable<Noticia> {
  	return of(NOTICIAS[0]);
  }

  get(id: number): Observable<Noticia> {
  	return of(NOTICIAS.find(noticia => noticia.id === id));
  }

  remove(id: number): void {
    let index = NOTICIAS.indexOf(NOTICIAS.find(noticia => noticia.id === id));
    this.noticias.remove(String(NOTICIAS[index].id)).then(_ => {
      //NOTICIAS.splice(index,1);
      this.router.navigate(["/noticias"]);
      this.messageService.add("Notícia removida!");
    })
  }

  update(noticia: Noticia): void {
    let index = NOTICIAS.indexOf(NOTICIAS.find(item => item.id === noticia.id));
    this.noticias.update(String(noticia.id),NoticiaEncapsulator.encapsule(noticia)).then(_ => {
      NOTICIAS[index].titulo = noticia.titulo;
      NOTICIAS[index].conteudo = noticia.conteudo;
      NOTICIAS[index].dataEdicao = moment();
      NOTICIAS[index].imagemDestaque = noticia.imagemDestaque;
      this.router.navigate(['/noticia/'+noticia.id]);
      this.messageService.add("Notícia editada!");
    });
  }

  add(noticia: Noticia): void {
    this.noticias.set(String(noticia.id),NoticiaEncapsulator.encapsule(noticia)).then(_ => {
      this.router.navigate(['/noticia/'+noticia.id])
      this.messageService.add("Notícia adicionada!");
    })
  }

  generateEmptyNoticia(): Observable<Noticia> {
    let momento = moment();
    return of({id: -1, titulo: "", conteudo: "", dataCriacao: momento, dataEdicao: momento, imagemDestaque: ""});
  }
}
