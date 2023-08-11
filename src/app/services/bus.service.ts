import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BusService {
  selectedBusName: string = '-';

  private updateSelectedBusLocationListeners = new Subject<any>();
  private openBusRoutesModalListeners = new Subject<any>();

  updateSelectedBusLocationListen(): Observable<any> {
    return this.updateSelectedBusLocationListeners.asObservable();
  }

  openBusRoutesModalListen(): Observable<any> {
    return this.openBusRoutesModalListeners.asObservable();
  }

  updateSelectedBusLocation(routeCode: string) {
    this.updateSelectedBusLocationListeners.next(routeCode);
  }

  openBusRoutesModal(routes: object) {
    this.openBusRoutesModalListeners.next(routes);
  }
}
