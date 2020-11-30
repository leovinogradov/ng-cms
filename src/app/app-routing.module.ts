import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloComponent } from './views/hello/hello.component';
import { Page2Component } from './views/page2/page2.component';


const routes: Routes = [
  {
		path: '',
    component: HelloComponent
  },
  {
		path: 'page2',
    component: Page2Component
  },
  {
    path: 'page3',
    loadChildren: () => import('./views/page3/page3.module').then(m => m.Page3Module)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
