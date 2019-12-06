import { Component, OnInit, Input } from '@angular/core';
import { Noticia } from '../noticia';
import { NoticiaService } from '../noticia.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import * as moment from 'moment';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})

export class NoticiasComponent implements OnInit {
  noticias: Noticia[];
  noticiaSelecionada: Noticia;
  loaded: boolean = false;

  constructor(
    private noticiaService: NoticiaService,
    private messageService: MessageService,
    public auth: AuthService
    ) {
    
  }

  ngOnInit() {
    this.watch(this);
  }

  watch(self: NoticiasComponent) {
    if (self.noticiaService.isReady()) {
      self.noticiaService.getNoticias().subscribe(noticias => {
        self.noticias = noticias;
      });
      self.loaded = true;
    } else {
      let timer = setTimeout(self.watch, 1000, self);
    }
  }

  onSelect(noticia: Noticia) {
  	this.noticiaSelecionada = noticia;
  }

}
