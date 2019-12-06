import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { Bolsista } from './bolsista';
import { BolsistaService } from './bolsista.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseAuth } from 'angularfire2';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  firebaseAuth: FirebaseAuth

  constructor(
  	private messageService: MessageService,
  	private af: AngularFireAuth
  	) {
  	this.firebaseAuth = af.auth
  }

	login(user:string, password:string): Observable<Boolean> {
		var result: Boolean
		this.firebaseAuth.signInWithEmailAndPassword(user,password)
			.then(r => result = r)
			.catch(e => this.messageService.add("Login e/ou senha inválidos!"))
		return of(result)
	}  

	isReady(): boolean {
		return this.firebaseAuth !== undefined
	}     

	logout() {
	    this.firebaseAuth.signOut()
	}

	public loggedIn(): Boolean {
	    return this.firebaseAuth.currentUser !== null
	}

	changePassword(user: string) {
		var auth = this.firebaseAuth
	    return auth.sendPasswordResetEmail(user)
	      .then(() => this.messageService.add("Enviamos um email para mudar a senha!"))
	}

	getLoggedUser(): string {
		return this.firebaseAuth.currentUser.email
	}

}
