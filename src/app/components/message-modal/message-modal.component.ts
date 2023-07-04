import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalMessage } from 'src/app/types/modal-message';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss'],
})
export class MessageModalComponent {
  @Input() modalMessage: ModalMessage | null = null;
  @Output() close = new EventEmitter<void>();
}
