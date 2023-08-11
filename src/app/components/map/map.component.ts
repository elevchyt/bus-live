import { BusService } from './../../services/bus.service';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import busStopsData from '../../../assets/bus-stops.json';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  subscriptions: Array<Subscription> = [];
  platform: any;
  map: any;
  ui: any;

  busStopsGroup = new H.map.Group();
  busesGroup = new H.map.Group();
  personMarker: any;

  currentActiveRouteCode: string; // the route code of the currently selected bus that is being watched live by the user

  checkForBusLocationsInterval: any;

  constructor(private busService: BusService, private http: HttpClient) {
    // Map API Auth
    this.platform = new H.service.Platform({
      apikey: 'LdxjfnzINnwrxVB-SH965nqjxy-SyJYbUyT8B_fwN8s',
      useHTTPS: true,
    });

    // Set selected bus location
    const subscription: Subscription = this.busService
      .setSelectedBusLocationListen()
      .subscribe((routeCode: string) => {
        // Get bus location for the selected route
        this.http
          .get(`http://localhost:4300/bus-location/${routeCode}`)
          .subscribe((res: any) => {
            // If no bus location is found, inform the user that there is no active bus for this route at the moment
            if (res.noActiveBusFound) {
              alert('There are no active buses in this route!');
            }
            // If bus location is found, add buses markers & set view of map to the first bus found
            else {
              this.busService.currentActiveRouteCode = routeCode; // is used for polling if there is a bus in the route
              this.addBusMarkers(res);
              this.setCenterToLocation(res[0]['CS_LAT'], res[0]['CS_LNG'], 16);
            }
          });
      });
    this.subscriptions.push(subscription);
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

  addBusStopsMarkers() {
    const busStopSvg =
      '<svg width="8" height="8" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#A0A0A0" stroke="#64646499" stroke-width="2" style="opacity: 0.3" /></svg>';
    const busStopIcon = new H.map.Icon(busStopSvg);
    const busStops = busStopsData.busStops;
    busStops.forEach((busStop) => {
      const busStopMarker = new H.map.Marker(
        { lat: busStop['latitude'], lng: busStop['longitude'] },
        { icon: busStopIcon }
      );
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
  addBusMarkers(busLocations: any[]) {
    // Clear previous markers first (if there are any...)
    this.clearBusMarkers();

    const busSvg =
      '<svg width="16" height="16" fill="none" style="overflow: visible;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#000000" style="opacity: 0.15;" stroke-width="24" />' +
      '<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#6da0fd" stroke="#ffffff" stroke-width="2" />' +
      '<text x="-4" y="48" fill="#fae50f" stroke="black" class="font-sans" style="font-size: 2rem; font-weight: 800;text-shadow: 0 0px 18px rgba(0, 0, 0, 0.4);user-select: none;">' +
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
      this.busesGroup.addObject(busMarker);
    });
    this.map.addObject(this.busesGroup);
  }

  checkForNewBusLocation() {
    if (this.busService.currentActiveRouteCode) {
      this.http
        .get(
          `http://localhost:4300/bus-location/${this.busService.currentActiveRouteCode}`
        )
        .subscribe((res: any) => {
          // If at some point we get a bad response, remove all markers & reset the bus service's data
          if (res.noActiveBusFound) {
            this.clearBusMarkers();
            this.busService.currentActiveRouteCode = '';
            this.busService.selectedBusName = '';
          }
          // If bus location is found, add the new buses markers
          else {
            this.addBusMarkers(res);
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addBusStopsMarkers();
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
      console.warn('Updating bus locations...');
      this.checkForNewBusLocation();
    }, 6000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    clearInterval(this.checkForBusLocationsInterval);
  }
}
