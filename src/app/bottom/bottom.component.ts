import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.css']
})
export class BottomComponent implements OnInit {
  bolsista: Boolean = false;
  selected: String = "";
  static component: BottomComponent;

  constructor(
    private router: Router,
    private messageService: MessageService
    ) {

  }

  ngOnInit() {
    if (!BottomComponent.component) {
      BottomComponent.component = this;
    }
  }

  goToInicio(): void {
    this.router.navigate(['/inicio']);
    this.messageService.clear();
  }

  goToAcervo(): void {
  	this.router.navigate(['/jogos']);
    this.messageService.clear();
  }

  goToNoticias(): void {
  	this.router.navigate(['/noticias']);
    this.messageService.clear();
  }

  goToCalendario(): void {
    this.router.navigate(['/calendario']);
    this.messageService.clear();
  }

}