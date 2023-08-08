import { Component, AfterViewInit } from '@angular/core';

declare var H: any;
type GeolocationType = {
  lat: number;
  lng: number;
};

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
        center: { lat: 50, lng: 5 },
        zoom: 4,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    window.addEventListener('resize', () => this.map.getViewPort().resize());

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    var ui = H.ui.UI.createDefault(this.map, defaultLayers);
  }

  setCenterToLocation(lat: number, lng: number, zoomLevel: number) {
    this.map.setCenter({lat, lng});
    this.map.setZoom(zoomLevel, true)
  }

  getUserLocation(): Promise<GeolocationPosition> {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getUserLocation().then(position => {
      this.setCenterToLocation(position.coords.latitude, position.coords.longitude, 15);
    });
  }
}
