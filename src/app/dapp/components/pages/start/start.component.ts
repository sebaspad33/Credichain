import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {

  @Output() closePopup = new EventEmitter<void>();

  onClose(): void {
    this.closePopup.emit();
  }
}
