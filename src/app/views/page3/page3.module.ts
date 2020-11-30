import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Page3Component } from './page3.component';

@NgModule({
  declarations: [
    Page3Component
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: Page3Component
      },
      {
        path: 'test',
        component: Page3Component
      },
      {
        path: 'test:id',
        component: Page3Component
      },
      // {
      //   path: 'test2',
      //   loadChildren: () => import('./page3.module').then(m => m.Page3Module)
      // },
      {
        path: 'subpagetest',
        loadChildren: () => import('./page3_1/page3_1.module').then(m => m.Page3_1Module)
      }
    ])
	],
})
export class Page3Module { }
