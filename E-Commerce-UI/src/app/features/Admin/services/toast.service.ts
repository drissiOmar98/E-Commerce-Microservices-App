import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Message} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  // A constant representing the initial state for the toast notifications.
  INIT_STATE = "INIT";

  // BehaviorSubject to hold and emit the current message state.
  // Initializes with a default message with a summary of INIT_STATE.
  private send$ = new BehaviorSubject<Message>({summary: this.INIT_STATE});

  // Exposes the BehaviorSubject as an Observable to allow components to subscribe to message changes.
  sendSub = this.send$.asObservable();

  // Method to send a new message by updating the current value of the BehaviorSubject.
  // It triggers all subscribers with the new message.
  public send(message: Message): void {
    this.send$.next(message);
  }


  constructor() { }
}
