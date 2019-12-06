import { Injectable } from '@angular/core';
import { Categoria } from './categoria';
import { CATEGORIAS } from './mock-categorias';
import { JogoService } from './jogo.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class CategoriaService {

  categorias: AngularFireList<Categoria>
  static loaded: boolean = false;
  constructor(
    private messageService: MessageService,
    private jogoService: JogoService,
    private db: AngularFireDatabase
    ) {
    this.categorias = db.list("/categorias")
    this.categorias.valueChanges()
      .subscribe(c => {
        CATEGORIAS.length = 0
        CATEGORIAS.push(...c)
        CategoriaService.loaded = true;
      })
  }

  isReady(): boolean {
    return CategoriaService.loaded
  }

  getCategorias(): Observable<Categoria[]> {
  	return of(CATEGORIAS);
  }

  get(id: number): Observable<Categoria> {
  	return of(CATEGORIAS.find(categoria => categoria.id === id))
  }

  update(categoria: Categoria): void {
  	let index = CATEGORIAS.indexOf(CATEGORIAS.find(item => item.id === categoria.id));
    this.categorias.update(String(categoria.id),categoria).then(_ => {
      CATEGORIAS[index].nome = categoria.nome;
      this.messageService.add("Categorias salvas!");
    })
  }

  remove(id: number): void {
  	let index = CATEGORIAS.indexOf(CATEGORIAS.find(item => item.id === id));
    this.categorias.remove(String(id)).then(_ => {
      this.jogoService.removeCategoriaFromAll(CATEGORIAS.splice(index,1)[0])
        .subscribe(resultado => this.messageService.add("Categoria removida!"))
    })
  }

  add(categoria: Categoria): void {
    categoria.id = Math.floor(Date.now() + Math.random()*100);
    this.categorias.set(String(categoria.id),categoria).then(_ => {
      
    })
  }

  generateEmptyCategoria(): Observable<Categoria> {
    return of({id: -1, nome: ""});
  }

}
