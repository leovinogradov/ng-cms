import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Page3_1Component } from './page3_1.component';


@NgModule({
  declarations: [
    Page3_1Component
  ],
  imports: [
    RouterModule.forChild([
			{
				path: '',
        component: Page3_1Component
      },
      {
				path: 'test2',
        component: Page3_1Component
      },
		]),
	],
})
export class Page3_1Module { }
