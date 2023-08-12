import { Component } from '@angular/core';
import { BusService } from './services/bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(public busService: BusService) {}
}
