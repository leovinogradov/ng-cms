import { Component } from '@angular/core';

@Component({
  selector: 'bootstrap-row',
  template: `<div class="container">
    <div class="row">
      <p>Hi im a row 2</p>
      <ng-content></ng-content>
    </div>
  </div>`
})
export class BootstrapRowComponent{
  constructor() {
  }
}