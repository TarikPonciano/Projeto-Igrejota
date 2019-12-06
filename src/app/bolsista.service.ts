import { Injectable } from '@angular/core';
import { Bolsista } from './bolsista';
import { BOLSISTAS } from './mock-bolsistas';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';

@Injectable()
export class BolsistaService {
    constructor() {
    }

    getBolsistas(): Observable<Bolsista[]> {
        return of(BOLSISTAS);
    }

    getBolsista(username: string): Observable<Bolsista> {
    	return of(BOLSISTAS.find(bolsista => bolsista.login === username));
    }

    validateLogin(login: string, senha: string): Observable<boolean> {
    	var bolsista: Bolsista;
    	this.getBolsista(login).subscribe(user => bolsista = user)
        if (!bolsista) {
    	    return of(false);
        }
        return of(bolsista.senha === senha && bolsista.login === login);
    }
}