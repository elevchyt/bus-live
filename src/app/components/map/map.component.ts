import { BusService } from './../../services/bus.service';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AnimationUtils } from 'src/app/utils/animation-utils';
import { environment } from 'src/environment';
import { ApiService } from 'src/app/services/api.service';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stopInfoPanel')
  stopInfoPanel: ElementRef<HTMLElement>;

  subscriptions: Subscription[] = [];
  platform: any;
  map: any;
  ui: any;
  selectedStopData: any;
  isStopSelected: boolean;

  busStopsGroup = new H.map.Group();
  busesGroup = new H.map.Group();
  personMarker: any;

  currentActiveRouteCode: string; // the route code of the currently selected bus that is being watched live by the user

  checkForBusLocationsInterval: ReturnType<typeof setInterval>;
  userLocationUpdateInterval: ReturnType<typeof setInterval>;

  constructor(
    private busService: BusService,
    private http: HttpClient,
    private animationUtils: AnimationUtils,
    private apiService: ApiService
  ) {
    // Map API Auth
    this.platform = new H.service.Platform({
      apikey: environment.hereApiKey,
      useHTTPS: true,
    });

    // Set selected bus location
    const busLocationSubscription: Subscription = this.busService
      .setSelectedBusLocationListen()
      .subscribe((routeCode: string) => {
        // Get bus location for the selected route
        this.apiService
          .get(`bus-location/${routeCode}`)
          .subscribe((res: any) => {
            // If no bus location is found, inform the user that there is no active bus for this route at the moment
            if (res.noActiveBusFound) {
              // alert('There are no active buses in this route!');
            }
            // If bus location is found, add buses markers & set view of map to the first bus found
            else {
              this.busService.currentActiveRouteCode = routeCode; // is used for polling if there is a bus in the route
              this.addBusMarkers(res);
              this.setCenterToLocation(res[0]['CS_LAT'], res[0]['CS_LNG'], 16);
            }
          });
      });
    this.subscriptions.push(busLocationSubscription);

    // Set selected bus location
    const busStopsSubscription: Subscription = this.busService
      .setBusStopsListen()
      .subscribe((busStops) => {
        this.addBusStopsMarkers(busStops);
      });
    this.subscriptions.push(busStopsSubscription);
  }

  initMap(): void {
    let defaultLayers = this.platform.createDefaultLayers();

    this.map = new H.Map(
      document.getElementById('map-container'),
      defaultLayers.vector.normal.map,
      {
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    window.addEventListener('resize', () => this.map.getViewPort().resize());

    let behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(this.map)
    );
    // this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // Set custom map style
    let provider = this.map.getBaseLayer().getProvider();
    let style = new H.map.Style('/assets/map-theme-day.yaml');
    provider.setStyle(style);

    // Set initial center to Athens, Greece
    this.setCenterToLocation(37.9838, 23.7275, 16);
  }

  setCenterToLocation(lat: number, lng: number, zoomLevel: number) {
    this.map.setCenter({ lat, lng });
    this.map.setZoom(zoomLevel, false);
  }

  addUserLocationMarker(lat: number, lng: number) {
    const personSvg =
      '<svg width="16" height="16" fill="none" style="overflow: visible;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#000000" style="opacity: 0.15;" stroke-width="24" />' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#f68221" stroke="#ffffff" stroke-width="2" /></svg>';

    const personIcon = new H.map.DomIcon(personSvg);
    this.personMarker = new H.map.DomMarker(
      { lat: lat, lng: lng },
      { icon: personIcon }
    );
    this.map.addObject(this.personMarker);
  }

  getUserLocation(): Promise<GeolocationPosition> {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  addBusStopsMarkers(busStops: any[]) {
    // Clear previous bus stops first (if there are any...)
    this.clearStopsMarkers();

    const busStopSvg =
      '<svg width="16" height="16" fill="none" style="overflow: visible;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#fcfc03" stroke="#646464" style="opacity: 0;" stroke-width="34" />' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#fcfc03" stroke="#646464" stroke-width="2" />' +
      '<text x="-8" y="62" fill="#fcfc03" class="font-sans" style="font-size: 3rem; font-weight: 800;text-shadow: 0 0px 18px rgba(0, 0, 0, 0.4);filter: drop-shadow(2px 4px 6px black);user-select: none;"></svg>';

    const busStopIcon = new H.map.DomIcon(busStopSvg);
    busStops.forEach((busStop: any) => {
      const busStopMarker = new H.map.DomMarker(
        { lat: busStop['StopLat'], lng: busStop['StopLng'] },
        { icon: busStopIcon }
      );

      // Tap behaviour for showing bus times on tapping a bus stop
      busStopMarker.addEventListener('tap', () => {
        this.apiService
          .get(`stop-times-info/${busStop['StopCode']}`)
          .subscribe((stopTimesRes: any) => {
            this.isStopSelected = true;
            this.selectedStopData = {
              stopName: busStop['StopDescr'],
              stopNameEng: busStop['StopDescrEng'],
              stopTimes: stopTimesRes,
            };
          });
      });
      this.busStopsGroup.addObject(busStopMarker);
    });
    this.map.addObject(this.busStopsGroup);
  }

  clearBusMarkers() {
    if (this.busesGroup.getObjects().length) {
      this.busesGroup.removeAll();
      this.map.removeObject(this.busesGroup);
    }
  }

  clearStopsMarkers() {
    if (this.busStopsGroup.getObjects().length) {
      this.busStopsGroup.removeAll();
      this.map.removeObject(this.busStopsGroup);
    }
  }

  addBusMarkers(busLocations: any[]) {
    // Clear previous bus markers first (if there are any...)
    this.clearBusMarkers();

    const busSvg =
      '<svg width="16" height="16" fill="none" style="overflow: visible;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#000000" style="opacity: 0.15;" stroke-width="24" />' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#ffffff" stroke-width="2" />' +
      '<text x="-8" y="62" fill="#fcfc03" class="font-sans" style="font-size: 3rem; font-weight: 800;text-shadow: 0 0px 18px rgba(0, 0, 0, 0.4);filter: drop-shadow(2px 4px 6px black);user-select: none;">' +
      'BUS_NAME</text></svg>'.replace(
        'BUS_NAME',
        this.busService.selectedBusName
      );
    const busIcon = new H.map.DomIcon(busSvg);
    busLocations.forEach((bus) => {
      const busMarker = new H.map.DomMarker(
        { lat: Number(bus['CS_LAT']), lng: Number(bus['CS_LNG']) },
        { icon: busIcon }
      );
      // Set an ID for this marker. We later use it to update the vehicle's position.
      busMarker.setData({
        id: bus['VEH_NO'],
      });
      this.busesGroup.addObject(busMarker);
    });
    this.map.addObject(this.busesGroup);
  }

  addSingleBusMarker(bus: any) {
    const busSvg =
      '<svg width="16" height="16" fill="none" style="overflow: visible;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#000000" style="opacity: 0.15;" stroke-width="24" />' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#ffffff" stroke-width="2" />' +
      '<text x="-8" y="62" fill="#fcfc03" class="font-sans" style="font-size: 3rem; font-weight: 800;text-shadow: 0 0px 18px rgba(0, 0, 0, 0.4);filter: drop-shadow(2px 4px 6px black);user-select: none;">' +
      'BUS_NAME</text></svg>'.replace(
        'BUS_NAME',
        this.busService.selectedBusName
      );
    const busIcon = new H.map.DomIcon(busSvg);
    const busMarker = new H.map.DomMarker(
      { lat: Number(bus['CS_LAT']), lng: Number(bus['CS_LNG']) },
      { icon: busIcon }
    );
    // Set an ID for this marker. We later use it to update the vehicle's position.
    busMarker.setData({
      id: bus['VEH_NO'],
    });
    this.busesGroup.addObject(busMarker);
    this.map.addObject(this.busesGroup);
  }

  // Responsible for smoothly moving bus markers to their updated locations, removing junk markers and adding newly fetched ones
  updateBusMarkers(newLocations: any) {
    let validBusesIds: any[] = [];
    newLocations.forEach((fetchedBus: any) => {
      // Match the fetched buses to the existing buses, if one is not found that means that this fetched bus is NEW, so we need to add it
      let currBusMarker: any; // validBusesIds are buses that exist, we later compare them to the existing array of buses to remove unused/finished buses
      let fetchedCurrBus: any; // the marker with the most updated data for currBusMarker (aka the fetched bus that already exists but has updated data)
      for (let busMarker of this.busesGroup.getObjects()) {
        if (busMarker.getData().id == fetchedBus['VEH_NO']) {
          currBusMarker = busMarker;
          fetchedCurrBus = fetchedBus;
          validBusesIds.push(busMarker.getData().id);
          break;
        }
      }

      // If fetched bus doesn't match a bus on the map, we create that bus
      if (!currBusMarker) {
        this.addSingleBusMarker(fetchedBus);
        validBusesIds.push(fetchedBus['VEH_NO']); // add id to valid buses so that the marker doesn't get deleted immediately
      }
      // If fetched bus matches a bus on the map, we updated that marker's position to the fetched bus's position
      else {
        // console.log(String(fetchedCurrBus['CS_LAT']) + ' - ' + String(fetchedCurrBus['CS_LNG']));
        this.animationUtils.ease(
          currBusMarker.getGeometry(),
          { lat: fetchedCurrBus['CS_LAT'], lng: fetchedCurrBus['CS_LNG'] },
          60000,
          function (coord) {
            currBusMarker.setGeometry(coord);
          }
        );
      }
    });

    // Finally, remove buses that are not inside validBuses
    this.busesGroup.getObjects().forEach((currBusMarker: any) => {
      if (!validBusesIds.includes(currBusMarker.getData().id)) {
        console.log(
          `Vehicle with ID ${
            currBusMarker.getData().id
          } has been removed as it wasn't returned from OASA in the latest bus locations update!`
        );
        this.busesGroup.removeObject(currBusMarker);
      }
    });
  }

  checkForNewBusLocation() {
    if (this.busService.currentActiveRouteCode) {
      console.warn('Updating bus markers...');

      this.apiService
        .get(`bus-location/${this.busService.currentActiveRouteCode}`)
        .subscribe((res: any) => {
          // If at some point we get a bad response, remove all markers & reset the bus service's data
          if (res.noActiveBusFound) {
            this.clearBusMarkers();
            this.busService.currentActiveRouteCode = '';
            this.busService.selectedBusName = '';
          }
          // If bus location is found, update the bus markers
          else {
            // this.addBusMarkers(res);
            this.updateBusMarkers(res);
          }
        });
    }
  }

  closeStopInfoModal() {
    this.isStopSelected = false;
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getUserLocation().then((position) => {
      this.setCenterToLocation(
        position.coords.latitude,
        position.coords.longitude,
        16
      );
      this.addUserLocationMarker(
        position.coords.latitude,
        position.coords.longitude
      );
    });

    // Update the buses' location if there is a bus that the user is currently watching
    this.checkForBusLocationsInterval = setInterval(() => {
      this.checkForNewBusLocation();
    }, 6000);

    // Update the user's location
    // this.userLocationUpdateInterval = setInterval(() => {
    //   this.getUserLocation().then((position) => {
    //     this.map.removeObject(this.personMarker);
    //     this.addUserLocationMarker(
    //       position.coords.latitude,
    //       position.coords.longitude
    //     );
    //   });
    // }, 3000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    clearInterval(this.checkForBusLocationsInterval);
  }
}
