import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// const selectedBorderColor = 'rgb(33, 150, 243)';
const selectedBorderStyle = '1px solid rgb(33, 150, 243)';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myapp';
  appNodeName = 'APP-ROOT';
  currentTgt: any;
  path: Array<any>;
  indexInPath: number;
  maxIndexInPath: number;
  root: boolean = true;
  availableElements: any;
  availableCategories: Array<any>;
  // descriptivePath: Array<any>;
  // elementToInsert: any;
  elementsToIgnore = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'router-outlet'];

  constructor(
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(e => e instanceof RouteConfigLoadEnd)
    ).subscribe(e => {
      console.log('TEST', e);
      console.log(this.router.config);
    });
  }

  ngOnInit() {
    document.addEventListener("click", this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    this.http.get('http://localhost:5000/elements').subscribe((data: any) => {
      if (data) {
        this.availableElements = data.__elements__;
        this.availableCategories = data.__categories__;
        this.ref.detectChanges();
      }
    });
  }

  getElementsFromCategory(categoryKey: string) {
    return Object.values(this.availableElements[categoryKey])
  }

  handleClick(e: any) {
    // console.log(e);
    
    if (e.target && e.target.localName == 'body') {
      if (this.currentTgt && this.currentTgt.style.border == selectedBorderStyle) {
        this.removeCurrentTgtHighlight();
      }
      this.root = true;
      this.currentTgt = null;
      console.log('Target is body');
      return;
    }

    if (e.path) {
      const path = e.path;
      // const appNodeName = this.appNodeName;
      // if (!appNodeName) throw Error('No appNodeName');
      const rootIndex = path.findIndex((i: any) => i.id == 'root-container');
      if (rootIndex != -1) {
        let tgtIndex = path.findIndex((i: any) => i.localName == 'div');
        if (tgtIndex != -1) {
          if (tgtIndex == rootIndex) {
            console.log('Target index is Root index');
          } else {
            if (this.currentTgt && this.currentTgt.style.border == selectedBorderStyle) {
              this.removeCurrentTgtHighlight();
            }
            this.currentTgt = path[tgtIndex];
            this.addCurrentTgtHighlight();
            console.log(this.currentTgt.style.borderColor);
            this.root = false;
            this.path = path;
            this.indexInPath = tgtIndex;
            this.maxIndexInPath = rootIndex;
            console.log('Found new target', this.currentTgt);
            return;
          }
        }
      }
    }

    // this.root = true;
    // this.currentTgt = null;
  }

  handleKeydown(e: any) {
    if (e.code == 'ArrowDown') {
      if (!this.root && this.indexInPath > 0) {
        this.indexInPath--;
        this.removeCurrentTgtHighlight();
        this.currentTgt = this.path[this.indexInPath];
        this.addCurrentTgtHighlight();
      }
    }
    else if (e.code == 'ArrowUp') {
      if (!this.root && this.indexInPath < this.maxIndexInPath) {
        this.indexInPath++;
        this.removeCurrentTgtHighlight();
        this.currentTgt = this.path[this.indexInPath];
        this.addCurrentTgtHighlight();
      }
    }
  }

  private _parseDocumentTree(element: Element) {
    let ret = [];
    for (var i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const localName = child.localName;
      if (!this.elementsToIgnore.includes(localName)) {
        ret.push(localName);
      }
      ret = ret.concat(this._parseDocumentTree(child));
    }
    return ret;
  }

  parseDocumentTree() {
    const appRoot = 'app-root';
    var root = document.getElementsByTagName(appRoot)[0];
    root = root.getElementsByClassName('root-container')[0];

    const angularElements = this._parseDocumentTree(root);
    console.log('Angular elements', angularElements);
  }


  generateDescriptivePath() {
    let idx = this.maxIndexInPath;
    let parent = this.path[idx]; // should be root element
    let el = this.path[--idx]; // go down 1

    if (idx <= 0 || idx < this.indexInPath) {
      throw Error('generateDescriptivePath: invalid index');
    }

    // Initiate with root element
    let descriptivePath = [];
    descriptivePath.push({
      localName: parent.localName,
      className: parent.className,
      index: 0,
      childCount: parent.children.length,
      parsableChildCount: null
    });

    while (true) {
      const description = {
        localName: el.localName,
        className: el.className,
        childCount: el.children.length,
        index: null,
        parsableChildCount: 0
      }

      let childNum = 0;
      for (var child of parent.children) {
        if (child == el) {
          description['index'] = childNum;
          break;
        }
        childNum += 1;
      }

      for (var child of el.children) {
        if (child.localName == 'div') {
          description.parsableChildCount += 1;
        }
      }

      descriptivePath.push(description);

      if (idx == this.indexInPath) {
        break;
      }

      parent = el;
      el = this.path[--idx];
    }

    console.log('descriptive path', descriptivePath);
    return descriptivePath;
  }

  // setElement(element) {
  //   this.elementToInsert = element;
  //   console.log('element to insert is', element);
  // }

  addElement(element) {
    console.log('Current target', this.currentTgt);
    console.log('Element to insert', element);
    if (!element) {
      console.log('Error: No element to insert');
      return;
    }

    const ob = this.http.post('http://localhost:5000/insert', {
      path: '/views/hello/hello.component.html',
      element: element,
      descriptivePath: this.generateDescriptivePath()
    });

    ob.subscribe({
      next: x => console.log('Observer got a next value: ', x),
      error: err => console.error('Observer got an error: ', err),
      complete: () => console.log('Observer got a complete notification'),
    });
  }

  removeCurrentTgtHighlight(): void {
    this.currentTgt.style.border = null;
  }

  addCurrentTgtHighlight(): void {
    this.currentTgt.style.border = selectedBorderStyle;
    // this.currentTgt.style.borderColor = selectedBorderColor;
  }
}
