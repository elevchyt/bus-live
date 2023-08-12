import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BusService } from 'src/app/services/bus.service';

type ModesType = 'routeSelect' | 'routeInfo' | 'timesInfo';

@Component({
  selector: 'app-route-modal',
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.scss'],
})
export class RouteModalComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = [];
  isModalOpen: boolean = false;
  isStopsRequestPending: boolean = false;
  isScheduleRequestPending: boolean = false;
  routes: any[] = [];
  selectedRoute: any;
  stops: any[] = [];
  arrivalTimes: any[] = [];
  returnTimes: any[] = [];

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
    this.busService.setSelectedBusLocation(route.RouteCode);
    this.selectedRoute = route;
    this.currentMode = 'routeInfo';
    this.getRouteStops(route.RouteCode);
  }

  getRouteStops(routeCode: any) {
    if (routeCode) {
      this.isStopsRequestPending = true;
      this.stops = [];
      this.apiService.get(`route-stops/${routeCode}`).subscribe((res: any) => {
        this.stops = res;
        this.isStopsRequestPending = false;
      });
    }
  }

  onTimesSelect() {
    this.currentMode = 'timesInfo';
    this.getLineTimes();
  }

  getLineTimes() {
    this.arrivalTimes = [];
    this.returnTimes = [];
    this.isScheduleRequestPending = true;
    this.apiService
      .get(`line-scheduled-times/${this.busService.selectedBusName}`)
      .subscribe((res: any) => {
        this.isScheduleRequestPending = false;

        if (res.come?.length) {
          res.come.forEach((timeData: any) => {
            const parsedDate = new Date(timeData.sde_start2);
            const formattedTime = parsedDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });

            if (!this.returnTimes.includes(formattedTime)) {
              this.returnTimes.push(formattedTime);
            }
          });
        }

        if (res.go?.length) {
          res.go.forEach((timeData: any) => {
            const parsedDate = new Date(timeData.sde_start1);
            const formattedTime = parsedDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            if (!this.arrivalTimes.includes(formattedTime)) {
              this.arrivalTimes.push(formattedTime);
            }
          });
        }
      });
  }

  onTimesBackSelect() {
    this.currentMode = 'routeInfo';
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
