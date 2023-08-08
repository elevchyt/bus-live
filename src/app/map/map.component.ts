import { Component, AfterViewInit } from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  platform;

  constructor() {
    this.platform = new H.service.Platform({
      apikey: 'LdxjfnzINnwrxVB-SH965nqjxy-SyJYbUyT8B_fwN8s',
      useHTTPS: true,
    });
  }

  setCenterToLocation(lat: number, lng: number, zoomLevel: number) {
    
  }

  initMap(): void {
    var defaultLayers = this.platform.createDefaultLayers();

    var map = new H.Map(document.getElementById('map-container'),
      defaultLayers.vector.normal.map,{
      center: {lat:50, lng:5},
      zoom: 4,
      pixelRatio: window.devicePixelRatio || 1
    });
    window.addEventListener('resize', () => map.getViewPort().resize());
    
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    var ui = H.ui.UI.createDefault(map, defaultLayers);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
