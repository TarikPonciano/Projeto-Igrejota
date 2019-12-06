import { Component, OnInit, Input } from '@angular/core';
import { Noticia } from '../noticia';
import { NoticiaService } from '../noticia.service';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-noticia-edit',
  templateUrl: './noticia-edit.component.html',
  styleUrls: ['./noticia-edit.component.css']
})

export class NoticiaEditComponent implements OnInit {
  @Input() noticia: Noticia;
  enviado: Boolean;
  task: AngularFireUploadTask;
  loaded: boolean = false;
  swapImage: boolean = false;
  sentRequest: boolean = false;

  constructor(
	  private noticiaService: NoticiaService,
    private messageService: MessageService,
    private storage: AngularFireStorage,
	  private route: ActivatedRoute,
	  private router: Router,
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

  watch(self: NoticiaEditComponent, id: number) {
    if (self.noticiaService.isReady()) {
      self.noticiaService.get(id)
        .subscribe(noticia => self.noticia = noticia);
      self.loaded = true
    } else {
      let timer = setTimeout(self.watch, 1000, self, id);
    }
  }

  onDelete(noticia: Noticia) {
  	this.messageService.displayAlert("Você têm certeza que deseja deletar a notícia?",NoticiaEditComponent.confirmDelete,NoticiaEditComponent.cancelAlert,this);
  }

  static cancelAlert(sender: NoticiaEditComponent) {

  }

  static confirmDelete(sender: NoticiaEditComponent) {
    let filePath = "noticia/"+sender.noticia.id;
    sender.sentRequest = true;
    sender.messageService.clear()
    sender.messageService.add("Deletando...")
    sender.noticiaService.remove(sender.noticia.id);
    sender.storage.ref(filePath).delete()
      .subscribe(_ => sender.router.navigate(['/noticias']));
  }

  noticiaValida(): Boolean {
    return this.noticia.titulo !== '' && this.noticia.conteudo !== '';
  }

  onSave() {
    if (this.sentRequest) {
      return
    }
    this.enviado = true;
    if (this.noticiaValida()) {
      let file = this.noticia.imagemDestaque
      if (!this.swapImage || !file) {
        this.sentRequest = true
        if (this.noticia.id === -1) {
          this.noticia.id = Math.floor(Date.now() + Math.random()*100)
          this.noticiaService.add(this.noticia);
        } else {
          this.noticiaService.update(this.noticia);
        }
      } else {
        var newnoticia = this.noticia.id === -1
        if (this.noticia.id !== -1) {
          this.storage.ref("noticia/"+this.noticia.id).delete()
        } else {
          this.noticia.id = Math.floor(Date.now() + Math.random()*100)
        }
        var filePath = "noticia/"+this.noticia.id;
        this.noticia.imagemDestaque = filePath

        if (file) {
          this.sentRequest = true
          this.task = this.storage.upload(filePath, file)
          this.task.snapshotChanges().pipe(finalize(() => {
              if (newnoticia) {
                this.noticiaService.add(this.noticia);
              } else {
                this.noticiaService.update(this.noticia);
              }
            })).subscribe()
        } else {
          this.task.cancel()
          this.router.navigate(['/noticia/'+this.noticia.id]);
        }
      }
    }
  }

  onCancel() {
    this.messageService.displayAlert("Você têm certeza que deseja cancelar a notícia?",NoticiaEditComponent.confirmCancel,NoticiaEditComponent.cancelAlert,this);
  }

  static confirmCancel(sender: any) {
    sender.router.navigate(["/noticias"]);
    sender.messageService.clear();
  }

  update(noticia: Noticia, event) {
    noticia.imagemDestaque = event.target.files[0];
    this.swapImage = true
  }
}
