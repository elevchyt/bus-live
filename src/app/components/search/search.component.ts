import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BusService } from 'src/app/services/bus.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('busStopSearchField')
  busStopSearchField: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private busService: BusService) {}

  onBusNameType(event: Event) {
    // Force uppercase when user is typing
    this.busStopSearchField.nativeElement.value =
      this.busStopSearchField.nativeElement.value.toUpperCase();
  }

  onBusNameFocus() {
    // Clear on focus
    this.busStopSearchField.nativeElement.value = '';
  }

  performSearch(unfocus: boolean) {
    const searchText = this.busStopSearchField.nativeElement.value;

    if (unfocus) {
      this.busStopSearchField.nativeElement.blur();
    }

    if (searchText) {
      this.http
        .get(`http://localhost:4300/bus-routes/${searchText}`)
        .subscribe((res) => {
          this.busService.openBusRoutesModal(res);
          this.busService.selectedBusName = searchText;
        });
    }
  }

  ngOnInit() {}
}
