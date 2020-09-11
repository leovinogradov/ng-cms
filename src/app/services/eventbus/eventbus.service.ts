import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/internal/operators';

@Injectable()
export class EventBusService {

  private subject$ = new Subject<any>();

  constructor() {
  }

  /* EVENT EMIT METHOD */
  emit(event: EventData) {
    this.subject$.next(event);
  }


  /* SUBSCRIPTION METHOD */
  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter( (e: EventData) => e.name === eventName),
      map( (e: EventData) => e["value"])).subscribe(action);
  }

}


/* EMIT DATA STRUCTURE */
export class EventData {
  name: string;
  value: any;
  constructor(name: string, value: any) {
      this.name = name;
      this.value = value;
  }
}
