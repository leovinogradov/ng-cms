import { Component, Input } from '@angular/core';

@Component({
  selector: 'bootstrap-column',
  template: 
  `<div class="bootstrap-column">
    <ng-content></ng-content>
  </div>`
})
export class BootstrapColumnComponent{
  @Input() smBreakpoint: number;
  @Input() mdBreakpoint: number;

  constructor() {
  }
}