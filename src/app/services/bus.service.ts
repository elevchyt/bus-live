import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BusService {
  selectedBusName: string = '';
  currentActiveRouteCode: string = '';
  isBusRequestPending: boolean;

  private setSelectedBusLocationListeners = new Subject<any>();
  private openBusRoutesModalListeners = new Subject<any>();

  setSelectedBusLocationListen(): Observable<any> {
    return this.setSelectedBusLocationListeners.asObservable();
  }

  openBusRoutesModalListen(): Observable<any> {
    return this.openBusRoutesModalListeners.asObservable();
  }

  setSelectedBusLocation(routeCode: string) {
    this.setSelectedBusLocationListeners.next(routeCode);
  }

  openBusRoutesModal(routes: object) {
    this.openBusRoutesModalListeners.next(routes);
  }
}
