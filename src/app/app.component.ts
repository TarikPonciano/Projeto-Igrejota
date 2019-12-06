import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BottomComponent } from './bottom/bottom.component';
import { TopbarComponent } from './topbar/topbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Igrejota';

  constructor(private router: Router) {
    
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        if (this.router.url === "/inicio") {
          TopbarComponent.returnLink.length = 0
        } else if (TopbarComponent.lastUrl && !TopbarComponent.lastUrl.includes("edit") && !this.isNumber(TopbarComponent.lastUrl)) {
          TopbarComponent.returnLink.push(TopbarComponent.lastUrl)
        }
        TopbarComponent.lastUrl = this.router.url
        this.setBottomMenu();
        window.scrollTo(0, 0);
    });
  }

  isNumber(text: string): boolean {
    var regexp = new RegExp('^[1-9]\d{0,2}$')
    return regexp.test(TopbarComponent.lastUrl)
  }

  setBottomMenu() {
    let path = this.router.url;
    if (this.router.url.includes("inicio")) {
      BottomComponent.component.selected = "inicio";
    } else if (this.router.url.includes("jogo")) {
      BottomComponent.component.selected = "jogos";
    } else if (this.router.url.includes("noticia")) {
      BottomComponent.component.selected = "noticias";
    } else {
      BottomComponent.component.selected = ""
    }
  }
}
