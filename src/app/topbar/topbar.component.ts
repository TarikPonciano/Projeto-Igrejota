import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  mostrarMenu: Boolean = false
  static returnLink: string[] = []
  static lastUrl: string = ""

  constructor(
  	private router: Router,
    private messageService: MessageService,
  	public auth: AuthService,
  	) {

  }

  ngOnInit() {
  	
  }

  goBack() {
    if (this.validReturn()) {
      let link = TopbarComponent.returnLink.splice(TopbarComponent.returnLink.length-1,1)[0]
      this.router.navigate([link]);
      TopbarComponent.lastUrl = ""
    }
  }

  validReturn(): boolean {
    return TopbarComponent.returnLink.length > 0
  }

  toggleMenu(): void {
    this.mostrarMenu = !this.mostrarMenu
  }

  goToGerenciarPerfil(): void {
    this.router.navigate(['/login']);
    this.toggleMenu()
  }

  goToGerenciarApp(): void {
    this.router.navigate(['/categorias/edit']);
    this.toggleMenu()
  }

  sair(): void {
  	this.auth.logout();
    this.toggleMenu();
  	this.router.navigate(['/inicio']);
    this.messageService.clear();
  }

}
