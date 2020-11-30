import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { parseRoutes } from '../parse-routes';

@Component({
  selector: 'app-page3_1',
  template: '<h2>Page 3 > 1</h2>'
  // templateUrl: './page2.component.html',
  // styleUrls: ['./page2.component.scss']
})
export class Page3_1Component {

  constructor(router: Router) {
    let root = parseRoutes(router);
    console.log('Root', root);
      // console.log('CONFIG1', router.config);
      // let config: any = router.config;
      // for (let item of config) {
      //   console.log('item', item);
      //   if (item._loadedConfig) {
      //     console.log('children', item._loadedConfig.routes);
      //   }
      // }
    //   parseModulesFromRouter(router, null);
  }
}