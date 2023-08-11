import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusService } from 'src/app/services/bus.service';

@Component({
  selector: 'app-route-modal',
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.scss'],
})
export class RouteModalComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = [];
  isModalOpen: boolean = false;
  routes: Array<any> = [];

  constructor(public busService: BusService) {
    // Open modal with fetched routes
    const subscription: Subscription = this.busService
      .openBusRoutesModalListen()
      .subscribe((routes: any) => {
        this.routes = routes;
        this.setModalOpen(true);
      });
    this.subscriptions.push(subscription);
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onRouteSelect(routeCode: string) {
    this.setModalOpen(false);
    this.busService.updateSelectedBusLocation(routeCode);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
