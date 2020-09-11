import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// const selectedBorderColor = 'rgb(33, 150, 243)';
const selectedBorderStyle = '1px solid rgb(33, 150, 243)';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myapp';
  appNodeName = 'APP-HELLO';
  currentTgt: any;
  path: Array<any>;
  indexInPath: number;
  maxIndexInPath: number;
  root: boolean = true;
  availableElements: any;
  availableCategories: Array<any>;
  // descriptivePath: Array<any>;

  constructor(
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) {}

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
    console.log(e);
    
    if (e.target && e.target.localName == 'body') {
      if (this.currentTgt && this.currentTgt.style.border == selectedBorderStyle) {
        this.removeCurrentTgtHighlight();
      }
      this.root = true;
      this.currentTgt = null;
      return;
    }

    if (e.path) {
      const path = e.path;
      const appNodeName = this.appNodeName;
      if (!appNodeName) throw Error('No appNodeName');
      const appIndex = path.findIndex((i: any) => i.nodeName == appNodeName);
      if (appIndex != -1) {
        let tgtIndex = path.findIndex((i: any) => i.localName == 'div');
        if (tgtIndex != -1) {
          if (tgtIndex == appIndex) {
            console.log('Target index is App index');
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
            this.maxIndexInPath = appIndex;
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

  addElement1() {
    console.log('Current target', this.currentTgt);
    const ob = this.http.post('http://localhost:5000/insert', {
      path: '/views/hello/hello.component.html',
      details: this.generateDescriptivePath()
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
