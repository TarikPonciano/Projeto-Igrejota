import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router'
import { NoticiaHighlightComponent } from './noticia-highlight/noticia-highlight.component';
import { NoticiaDetailComponent } from './noticia-detail/noticia-detail.component';
import { NoticiaEditComponent } from './noticia-edit/noticia-edit.component';
import { JogoComponent } from './jogo/jogo.component';
import { JogoDetailComponent } from './jogo-detail/jogo-detail.component';
import { JogoEditComponent } from './jogo-edit/jogo-edit.component';
import { CategoriaEditComponent } from './categoria-edit/categoria-edit.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { DiaPresencaComponent } from './dia-presenca/dia-presenca.component';
import { ListaAlunosComponent } from './lista-alunos/lista-alunos.component';
import { AppComponent } from './app.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: MainPageComponent },
  { path: 'noticias', component: NoticiaHighlightComponent },
  { path: 'noticia/:id', component: NoticiaDetailComponent },
  { path: 'noticia/edit/:id', component: NoticiaEditComponent, canActivate: [AuthGuard] },
  { path: 'categorias/edit', component: CategoriaEditComponent, canActivate: [AuthGuard] },
  //{ path: 'calendario', component: CalendarioComponent},
  //{ path: 'calendario/:data', component: DiaPresencaComponent},
  //{ path: 'calendario/add/:data', component: ListaAlunosComponent, canActivate: [AuthGuard]},
  { path: 'jogos', component: JogoComponent },
  { path: 'jogos/termoBusca/:termo', component: JogoComponent },
  { path: 'jogo/:id', component: JogoDetailComponent },
  { path: 'jogo/edit/:id', component: JogoEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {
	
}
