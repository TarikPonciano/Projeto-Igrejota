import { Component, OnInit, Input } from '@angular/core';
import { Noticia } from '../noticia';
import { NoticiaService } from '../noticia.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-noticia-highlight',
  templateUrl: './noticia-highlight.component.html',
  styleUrls: ['./noticia-highlight.component.css']
})

export class NoticiaHighlightComponent implements OnInit {
  noticiaDestacada: Noticia;
  noticiaSelecionada: Noticia;
  noticias: Noticia[];
  loaded: boolean = false;

  constructor(
    private noticiaService: NoticiaService,
    private messageService: MessageService,
    private router: Router,
    public auth: AuthService
    ) {
  	
  }

  ngOnInit() {
    this.watch(this);
  }

  watch(self: NoticiaHighlightComponent) {
    if (self.noticiaService.isReady()) {
      self.noticiaService.getNoticias().subscribe(noticias => {
        self.noticiaDestacada = noticias[0];
        if (noticias.length > 1) {
          self.noticias = noticias.slice(1);
        }
      });
      self.loaded = true;
    } else {
      let timer = setTimeout(self.watch, 1000, self);
    }
  }

  goToNoticia() {
    this.router.navigate(['noticia/'+this.noticiaDestacada.id]);
    this.messageService.clear();
  }

  onSelect(noticia: Noticia) {
    this.noticiaSelecionada = noticia;
  }

}
