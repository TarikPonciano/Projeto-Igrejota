import { Component, OnInit, Input } from '@angular/core';
import { Noticia } from '../noticia';
import { NoticiaService } from '../noticia.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-noticia-detail',
  templateUrl: './noticia-detail.component.html',
  styleUrls: ['./noticia-detail.component.css']
})

export class NoticiaDetailComponent implements OnInit {
  @Input() noticia: Noticia
  loaded: boolean = false;

  constructor(
    public auth: AuthService,
	  private noticiaService: NoticiaService,
    private messageService: MessageService,
	  private route: ActivatedRoute,
	  private location: Location
  ) {
  	
  }

  ngOnInit() {
  	const id = +this.route.snapshot.paramMap.get('id');
    if (id < -1) {
      this.loaded = true
    } else if (id === -1) {
      this.noticiaService.generateEmptyNoticia()
        .subscribe(noticia => {
          this.noticia = noticia
          this.loaded = true
        });
    } else {
      this.watch(this,id)
    }
  }

  watch(self: NoticiaDetailComponent, id: number) {
    if (self.noticiaService.isReady()) {
      self.getNoticia()
      self.loaded = true
    } else {
      let timer = setTimeout(self.watch, 1000, self, id);
    }
  }

  getNoticia(): void {
  	const id = +this.route.snapshot.paramMap.get('id');
  	this.noticiaService.get(id)
  		.subscribe(noticia => this.noticia = noticia);
  }

}
