import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BusService } from 'src/app/services/bus.service';
import { environment } from 'src/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('busStopSearchField')
  busStopSearchField: ElementRef<HTMLInputElement>;

  constructor(
    private http: HttpClient,
    private busService: BusService,
    private apiService: ApiService
  ) {}

  onBusNameType(event: Event) {
    // First, make sure that A, B, X (typed in English) are converted to their Greek equivalents (Α, Β & Χ) to compensate for potential user mistakes
    const currText = this.busStopSearchField.nativeElement.value
      .replace('A', 'Α')
      .replace('B', 'Β')
      .replace('X', 'Χ');

    // Force uppercase when user is typing
    this.busStopSearchField.nativeElement.value = currText.toUpperCase();
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
      this.apiService.get(`bus-routes/${searchText}`).subscribe((res) => {
        this.busService.openBusRoutesModal(res);
        this.busService.selectedBusName = searchText;
      }, (err) => {
        alert("This bus doesn't exist!")
      });
    }
  }

  ngOnInit() {}
}
