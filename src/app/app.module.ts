import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
// import {MatDialogModule} from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './views/hello/hello.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Page2Component } from './views/page2/page2.component';
import { BootstrapRowModule } from './components/bootstrap/row/bootstrap-row.module';
// import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    Page2Component
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    MatButtonModule,
    MatMenuModule,
    // MatDialogModule,
    BrowserAnimationsModule,
    BootstrapRowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
