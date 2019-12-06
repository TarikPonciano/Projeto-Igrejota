import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Categoria } from '../categoria';
import { CategoriaService } from '../categoria.service'
import { CATEGORIAS } from '../mock-categorias';

@Component({
  selector: 'app-categoria-select',
  templateUrl: './categoria-select.component.html',
  styleUrls: ['./categoria-select.component.css']
})
export class CategoriaSelectComponent implements OnInit {
  static categoriasEscolhidas: Categoria[];
  categorias: Categoria[] = [];
  loaded: boolean = false;

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    if (!CategoriaSelectComponent.categoriasEscolhidas) {
      CategoriaSelectComponent.categoriasEscolhidas = [];
    } else {
      CategoriaSelectComponent.categoriasEscolhidas.length = 0;
    }
  	this.watch(this);
  }

  watch(self: CategoriaSelectComponent) {
    if (self.categoriaService.isReady()) {
      self.getCategorias()
      self.loaded = true;
    }  else {
      let timer = setTimeout(self.watch, 1000, self);
    }
  }

  categoriaChecada(categoria: Categoria): Boolean {
    return CategoriaSelectComponent.categoriasEscolhidas.includes(categoria);
  }

  getCategorias(): void {
  	this.categoriaService.getCategorias()
  		.subscribe(categorias => this.categorias = categorias);
  }

  addCategoriaToSearch(categoria: Categoria): void {
  	CategoriaSelectComponent.categoriasEscolhidas.push(categoria);
  }

  removeCategoriaToSearch(categoria: Categoria): void {
  	let index = CategoriaSelectComponent.categoriasEscolhidas.indexOf(categoria);
  	CategoriaSelectComponent.categoriasEscolhidas.splice(index,1);
  }

  toggleCategoria(categoria: Categoria): void {
  	CategoriaSelectComponent.categoriasEscolhidas.includes(categoria) ? this.removeCategoriaToSearch(categoria) : this.addCategoriaToSearch(categoria);
  }

}
