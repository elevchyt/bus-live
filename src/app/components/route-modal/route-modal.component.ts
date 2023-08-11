import { Component, OnInit } from "@angular/core";
import { BusService } from "src/app/services/bus.service";

@Component({
  selector: "app-route-modal",
  templateUrl: "./route-modal.component.html",
  styleUrls: ["./route-modal.component.scss"]
})

export class RouteModalComponent implements OnInit {
  routes: Array<object> = [];
  isModalOpen: boolean = false;

  constructor(public busService: BusService) { 

  }

  ngOnInit() {

  }
}
