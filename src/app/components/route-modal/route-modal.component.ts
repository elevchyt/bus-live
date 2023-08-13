import { TimeUtils } from './../../utils/time-utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BusService } from 'src/app/services/bus.service';

type ModesType = 'routeSelect' | 'routeInfo' | 'timesInfo';
export type TimesType = {
  time: string;
  isNext: boolean;
};

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
  arrivalTimes: TimesType[] = [];
  returnTimes: TimesType[] = [];

  currentMode: ModesType = 'routeSelect';

  constructor(
    public busService: BusService,
    private apiService: ApiService,
    private timeUtils: TimeUtils
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
        this.busService.setBusStops(this.stops);
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

        const currentTime = new Date();
        const currentTimestamp = currentTime.getTime();

        if (res.come?.length) {
          res.come.forEach((timeData: any) => {
            const parsedDate = new Date(timeData.sde_start2);
            const formattedTime = parsedDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });

            const alreadyContainsTime = this.returnTimes.some(
              (obj) => obj.time === formattedTime
            );
            if (!alreadyContainsTime) {
              this.returnTimes.push({ time: formattedTime, isNext: false });
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

            const alreadyContainsTime = this.returnTimes.some(
              (obj) => obj.time === formattedTime
            );
            if (!alreadyContainsTime) {
              this.arrivalTimes.push({ time: formattedTime, isNext: false });
            }
          });
        }

        // Find closest the arrival & return times that are closest to the current time and set their isNext to true
        const closestReturnTime = this.timeUtils.findClosestFutureTime(
          this.returnTimes
        );
        const closestArrivalTime = this.timeUtils.findClosestFutureTime(
          this.arrivalTimes
        );

        for (let timeData of this.arrivalTimes) {
          if (timeData.time == closestArrivalTime) {
            timeData.isNext = true;
          }
        }
        for (let timeData of this.returnTimes) {
          if (timeData.time == closestReturnTime) {
            timeData.isNext = true;
          }
        }

        // Scroll each column to the time that has isNext
        setTimeout(() => {
          document
            .getElementsByClassName('closest-return-time')[0]
            ?.scrollIntoView({ behavior: 'instant' });
          document
            .getElementsByClassName('closest-arrival-time')[0]
            ?.scrollIntoView({ behavior: 'instant' });
        }, 100);
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
