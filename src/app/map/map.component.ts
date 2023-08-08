import { Component, AfterViewInit } from '@angular/core';
import busStopsData from '../../assets/bus-stops.json';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  platform: any;
  map: any;

  constructor() {
    this.platform = new H.service.Platform({
      apikey: 'LdxjfnzINnwrxVB-SH965nqjxy-SyJYbUyT8B_fwN8s',
      useHTTPS: true,
    });
  }

  initMap(): void {
    var defaultLayers = this.platform.createDefaultLayers();

    this.map = new H.Map(
      document.getElementById('map-container'),
      defaultLayers.vector.normal.map,
      {
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    window.addEventListener('resize', () => this.map.getViewPort().resize());

    var behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(this.map)
    );
    var ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // Set custom map style
    var provider = this.map.getBaseLayer().getProvider();
    var style = new H.map.Style('/assets/map-theme-day.yaml');
    provider.setStyle(style);
  }

  setCenterToLocation(lat: number, lng: number, zoomLevel: number) {
    this.map.setCenter({ lat, lng });
    this.map.setZoom(zoomLevel, false);
  }

  addUserLocationMarker(lat: number, lng: number) {
    const personSvg =
      '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#f68221" stroke="#ffffff" stroke-width="2" /></svg>';
    const personIcon = new H.map.Icon(personSvg);
    const personMarker = new H.map.Marker(
      { lat: lat, lng: lng },
      { icon: personIcon }
    );
    this.map.addObject(personMarker);
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
      '<svg width="8" height="8" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" fill="#A0A0A099" stroke="#64646499" stroke-width="2" /></svg>';
    const busStopIcon = new H.map.Icon(busStopSvg);
    const busStops = busStopsData.busStops;
    busStops.forEach((busStop) => {
      const busStopMarker = new H.map.Marker(
        { lat: busStop['latitude'], lng: busStop['longitude'] },
        { icon: busStopIcon }
      );
      this.map.addObject(busStopMarker);
    });
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
  }
}
