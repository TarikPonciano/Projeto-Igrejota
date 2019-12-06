import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Jogo } from '../jogo';
import { CategoriaSelectComponent } from '../categoria-select/categoria-select.component'
import { JogoService } from '../jogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRangeSliderComponent } from "ng2-ion-range-slider";
import { MessageService } from "../message.service";
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-jogo-edit',
  templateUrl: './jogo-edit.component.html',
  styleUrls: ['./jogo-edit.component.css']
})

export class JogoEditComponent implements OnInit {
  @Input() jogo: Jogo;
  @ViewChild('sliderJogadores') sliderJogadores: IonRangeSliderComponent;
  maisDe30: Boolean = false;
  enviado: Boolean;
  task: AngularFireUploadTask
  loaded: boolean = false;
  swapImage: boolean = false;
  sentRequest: boolean = false;

  constructor(
	  private jogoService: JogoService,
    private storage: AngularFireStorage,
	  private route: ActivatedRoute,
	  private router: Router,
    private messageService: MessageService
  ) {
  	
  }

  ngOnInit() {
  	const id = +this.route.snapshot.paramMap.get('id');
    if (id < -1) {
      this.loaded = true
    } else if (id === -1) {
      this.jogoService.generateEmptyJogo()
        .subscribe(jogo => {
          this.jogo = jogo
          this.loaded = true
        });
    } else {
      this.watch(this, id)
    }
  }

  watch(self: JogoEditComponent, id: number) {
    if (self.jogoService.isReady()) {
      self.jogoService.get(id)
        .subscribe(jogo => {
          self.jogo = jogo
          self.maisDe30 = jogo.maxJogadores > 30;
          CategoriaSelectComponent.categoriasEscolhidas = jogo.categorias;
        });
      self.loaded = true
    } else {
      let timer = setTimeout(self.watch, 1000, self, id);
    }
  }

  

  adjustNumeroJogadores(minJogadores: number, maxJogadores: number): void {
    this.jogo.minJogadores = minJogadores;
    this.jogo.maxJogadores = this.maisDe30 ? 31 : maxJogadores;
  }

  validarJogo(): Boolean {
    if (this.jogo.nome === "") {
      
    } else if (this.jogo.minJogadores <= 0 || this.jogo.maxJogadores < this.jogo.minJogadores || this.jogo.maxJogadores > 31) {
      this.messageService.add("Número de jogadores inválido!");
    } else if (this.jogo.tempoJogo < 0 || this.jogo.tempoJogo > 610) {
      this.messageService.add("Tempo do jogo inválido!");
    } else if (this.jogo.descricao === "") {
      
    } else {
      return true
    }
    return false
  }

  onSave(): void {
    if (this.sentRequest === true) {
      return
    }
    this.enviado = true;
    this.jogo.categorias = CategoriaSelectComponent.categoriasEscolhidas
    if (this.validarJogo()) {
      let file = this.jogo.imagemJogo
      if (!this.swapImage || !file) {
        this.sentRequest = true
        if (this.jogo.id === -1) {
          this.jogo.id = Math.floor(Date.now() + Math.random()*100)
          this.jogoService.add(this.jogo);
        } else {
          this.jogoService.edit(this.jogo);
        }
      } else {
        var newJogo = this.jogo.id === -1
        if (this.jogo.id !== -1) {
          this.storage.ref("capa/"+this.jogo.id).delete()
        } else {
          this.jogo.id = Math.floor(Date.now() + Math.random()*100)
        }
        var filePath = "capa/"+this.jogo.id;
        this.jogo.imagemJogo = filePath

        if (file) {
          this.sentRequest = true
          this.messageService.saveMessage();
          this.task = this.storage.upload(filePath, file)
          this.task.snapshotChanges().pipe(finalize(() => {
              if (newJogo) {
                this.jogoService.add(this.jogo);
              } else {
                this.jogoService.edit(this.jogo);
              }
            })).subscribe()
        } else {
          this.task.cancel()
          this.router.navigate(['/jogo/'+this.jogo.id]);
        }
      }
    }
  }

  static alertCancel(sender: JogoEditComponent) {
    sender.messageService.clear();
  }

  onDelete(): void {
    if (this.sentRequest) {
      return
    }
  	this.messageService.displayAlert("Você têm certeza que deseja deletar esse jogo?", JogoEditComponent.confirmDelete, JogoEditComponent.alertCancel, this);
  }

  static confirmDelete(sender: JogoEditComponent) {
    let filePath = "capa/"+sender.jogo.id
    sender.jogoService.remove(sender.jogo.id);
    sender.sentRequest = true
    sender.messageService.clear()
    sender.messageService.add("Deletando...");
    sender.storage.ref(filePath).delete()
      .subscribe(_ => sender.router.navigate(['/jogos']));
  }

  onCancel(): void {
    this.messageService.displayAlert("Você têm certeza que deseja cancelar a edição? As alterações feitas não serão salvas.", JogoEditComponent.confirmCancel, JogoEditComponent.alertCancel, this);
  }

  static confirmCancel(sender: JogoEditComponent) {
    sender.router.navigate(['/jogos']);
    sender.messageService.clear();
  }

  update(jogo: Jogo, event) {
    jogo.imagemJogo = event.target.files[0];
    this.swapImage = true;
  }
}
