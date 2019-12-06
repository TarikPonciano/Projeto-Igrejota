import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  messages: string[] = [];
  alert: Alert;

  add(message: string) {
    this.messages.length = 0
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
    this.clearAlert();
  }

  clearAlert() {
    this.alert = undefined;
  }

  displayAlert(message: string, yes: (any) => void, no: (any) => void, sender: any) {
  	this.alert = {message: message, yes: yes, no: no, sender: sender};
  }

  yes() {
  	this.alert.yes(this.alert.sender);
  	this.clearAlert();
  }

  no() {
  	this.alert.no(this.alert.sender);
  	this.clearAlert();
  }

  hasAlert() {
  	return this.alert !== undefined;
  }

  saveMessage() {
    this.clear()
    this.add("Salvando...")
  }
}

export class Alert {
	message: string
	yes: Function
	no: Function
	sender: any
}