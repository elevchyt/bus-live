import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BusService } from 'src/app/services/bus.service';

type ModesType = 'routeSelect' | 'routeInfo';

@Component({
  selector: 'app-route-modal',
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.scss'],
})
export class RouteModalComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = [];
  isModalOpen: boolean = false;
  routes: any[] = [];
  selectedRoute: any;
  stops: any[] = [];

  currentMode: ModesType = 'routeSelect';

  constructor(
    public busService: BusService,
    private http: HttpClient,
    private apiService: ApiService
  ) {
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
    this.currentMode = 'routeSelect';
  }

  onRouteSelect(route: any) {
    // this.setModalOpen(false);
    this.busService.setSelectedBusLocation(route.RouteCode);
    this.selectedRoute = route;
    this.currentMode = 'routeInfo';
    this.getRouteStops(route.RouteCode);
  }

  getRouteStops(routeCode: any) {
    if (routeCode) {
      this.apiService.get(`route-stops/${routeCode}`).subscribe((res: any) => {
        console.log(res);
      });
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
