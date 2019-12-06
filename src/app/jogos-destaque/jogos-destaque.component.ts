import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Jogo } from '../jogo';
import { JogoService } from '../jogo.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-jogos-destaque',
  templateUrl: './jogos-destaque.component.html',
  styleUrls: ['./jogos-destaque.component.css']
})

export class JogosDestaqueComponent implements OnInit
 {
  jogos: Jogo[];
  showSearch: boolean = false;
  termoPesquisa: string;
  loaded: boolean = false;

  constructor(
  	private jogoService: JogoService,
    private router: Router,
    private messageService: MessageService,
  	private auth: AuthService,
    private cdr: ChangeDetectorRef
  	) {
  	
  }

  ngOnInit() {
    this.watch(this);
  }

  watch(self: JogosDestaqueComponent) {
    if (self.jogoService.isReady()) {
      self.getJogos(self)
      self.loaded = true
    } else {
      let timer = setTimeout(self.watch, 1000, self);
    }
  }

  getJogos(self: JogosDestaqueComponent): void {
    self.jogoService.getJogosEmDestaque().subscribe(jogos => {
      self.jogos = jogos;
      self.cdr.detectChanges();
    });
  }

  goToJogoEmDestaque(jogo: Jogo) {
     this.router.navigate([this.auth.loggedIn() ? '/jogo/edit/'+jogo.id : '/jogo/'+jogo.id]);
     this.messageService.clear();
  }

  goToAcervo() {
    if (!this.showSearch) {
      this.showSearch = true;
      return;
    }
    if (!this.termoPesquisa) {
      this.showSearch = false;
      return;
    }
    this.router.navigate(['jogos/termoBusca/'+this.termoPesquisa]);
    this.messageService.clear();
  }
}
