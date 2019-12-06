import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { CalendarModule } from 'angular-calendar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaDetailComponent } from './noticia-detail/noticia-detail.component';
import { NoticiaEditComponent } from './noticia-edit/noticia-edit.component';
import { NoticiaHighlightComponent } from './noticia-highlight/noticia-highlight.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BottomComponent } from './bottom/bottom.component';
import { JogoComponent } from './jogo/jogo.component';
import { JogoDetailComponent } from './jogo-detail/jogo-detail.component';
import { JogoEditComponent } from './jogo-edit/jogo-edit.component';
import { CategoriaSelectComponent } from './categoria-select/categoria-select.component';
import { CategoriaEditComponent } from './categoria-edit/categoria-edit.component';

import { NoticiaService } from './noticia.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './/app-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { JogoService } from './jogo.service';
import { CategoriaService } from './categoria.service';
import { AuthService } from './auth.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { BolsistaService } from './bolsista.service';
import { JogosDestaqueComponent } from './jogos-destaque/jogos-destaque.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { DiaPresencaComponent } from './dia-presenca/dia-presenca.component';
import { ListaAlunosComponent } from './lista-alunos/lista-alunos.component';
import { DiasigrejotaService } from './diasigrejota.service';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NoticiasComponent,
    NoticiaDetailComponent,
    NoticiaEditComponent,
    NoticiaHighlightComponent,
    TopbarComponent,
    BottomComponent,
    JogoComponent,
    JogoDetailComponent,
    JogoEditComponent,
    CategoriaSelectComponent,
    CategoriaEditComponent,
    MessagesComponent,
    MainPageComponent,
    PageNotFoundComponent,
    LoginComponent,
    JogosDestaqueComponent,
    CalendarioComponent,
    DiaPresencaComponent,
    ListaAlunosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    IonRangeSliderModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'igrejotaapp'),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [
    AuthService,
    NoticiaService,
    MessageService,
    JogoService,
    CategoriaService,
    AuthGuardService,
    BolsistaService,
    DiasigrejotaService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
