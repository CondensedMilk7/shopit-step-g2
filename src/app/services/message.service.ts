import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalMessage } from '../types/modal-message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  message$ = new BehaviorSubject<ModalMessage | null>(null);

  message(message: ModalMessage | null) {
    this.message$.next(message);
  }
}
