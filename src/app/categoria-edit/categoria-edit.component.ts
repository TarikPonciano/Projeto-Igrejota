import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { MessageService } from '../message.service';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-categoria-edit',
  templateUrl: './categoria-edit.component.html',
  styleUrls: ['./categoria-edit.component.css']
})
export class CategoriaEditComponent implements OnInit {
  @Input() categorias: Categoria[];
  enviado: Boolean;
  loaded: boolean = false;
  categoriaToBeRemoved: Categoria;
  sentRequest: boolean = false;

  constructor(
  	private categoriaService: CategoriaService,
    private messageService: MessageService,
	  private router: Router
	) {

  }

  ngOnInit() {
  	this.watch(this);
  }

  watch(self: CategoriaEditComponent) {
    if (self.categoriaService.isReady()) {
      self.getCategorias()
      self.loaded = true;
    } else {
      let timer = setTimeout(self.watch, 1000, self);
    }
  }

  getCategorias() {
    this.categoriaService.getCategorias()
      .subscribe(categorias => this.categorias = categorias);
  }

  categoriasValidas(): Boolean {
    for (let categoria of this.categorias) {
      if (categoria.nome === "") {
        return false;
      }
    }
    return true;
  }

  saveAll(): void {
    this.enviado = true;
    if (this.categoriasValidas()) {
    	for (let categoria of this.categorias) {
    		this.onSave(categoria);
    	}
    	this.router.navigate(['/inicio']);
    }
  }

  onSave(categoria: Categoria): void {
  	categoria.id === -1 ? this.categoriaService.add(categoria) : this.categoriaService.update(categoria);
  }

  onDelete(categoria: Categoria): void {
    if (this.sentRequest) {
      return
    }
    this.categoriaToBeRemoved = categoria;
    this.messageService.displayAlert("Você têm certeza que deseja deletar essa categoria?", CategoriaEditComponent.confirmDelete, CategoriaEditComponent.alertCancel, this);
  }

  static confirmDelete(sender: CategoriaEditComponent) {
    sender.categoriaService.remove(sender.categoriaToBeRemoved.id);
    sender.getCategorias();
    sender.sentRequest = true;
  }

  static alertCancel() {

  }

  addCategoria(): void {
    if (this.sentRequest) {
      return
    }
  	this.categoriaService.generateEmptyCategoria()
  		.subscribe(categoria => this.categorias.push(categoria));
  }

}
