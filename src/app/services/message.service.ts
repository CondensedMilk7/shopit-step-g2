import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalMessage } from '../types/modal-message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private message$ = new BehaviorSubject<ModalMessage | null>(null);

  get message() {
    return this.message$.asObservable();
  }

  notify(message: ModalMessage | null) {
    this.message$.next(message);
  }
}
