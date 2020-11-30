import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { parseRoutes } from './parse-routes';

@Component({
  selector: 'app-page3',
  template: '<div class="container"><h2>Page 3</h2></div>'
  // templateUrl: './page2.component.html',
  // styleUrls: ['./page2.component.scss']
})
export class Page3Component implements OnInit {

  constructor(private router: Router) {
    // console.log(router);
    // console.log('CONFIG1', router.config);
    // this.router.events.pipe(
    //   // filter(e => e instanceof RouteConfigLoadEnd)
    // ).subscribe(e => {
    //   console.log('TEST', e);
    //   // console.log(this.router.config);
    // });
  }

  dothing(routes) {
    for (let item of routes) {
      console.log('item', item);
      if (item._loadedConfig) {
        console.log('children', item._loadedConfig.routes);
        this.dothing(item._loadedConfig.routes);
      } else if (item.loadChildren) {
        item.loadChildren().then(x => {
          console.log('children');
          console.log(x);
          console.log(this.router.config);
        })
      }
    }
  }

  ngOnInit() {
    let root = parseRoutes(this.router);
    console.log('Root', root);
    // this.dothing(this.router.config);
    // this.router.events.pipe(
    //   filter(e => e instanceof RouteConfigLoadEnd)
    // ).subscribe(e => {
    //   console.log('TEST', e);
    //   console.log(this.router.config);
    // });
  }
}