import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})

export class SearchComponent implements OnInit {
  @ViewChild('busStopSearchField') busStopSearchField: ElementRef<HTMLInputElement>;

  searchTimeout: ReturnType<typeof setTimeout>;

  onBusNameType(event: Event) {
    // Force uppercase when user is typing
    this.busStopSearchField.nativeElement.value = this.busStopSearchField.nativeElement.value.toUpperCase();

    // Perform search 3s after typing
    clearTimeout(this.searchTimeout);
    if (this.busStopSearchField.nativeElement.value) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch(false);
      }, 3000);
    }
  }

  onBusNameFocus() {
    // Clear on focus
    this.busStopSearchField.nativeElement.value = "";
  }

  performSearch(unfocus: boolean) {
    const searchText = this.busStopSearchField.nativeElement.value;
    
    if (unfocus) {
      this.busStopSearchField.nativeElement.blur();
    }

    if (searchText) {
      clearTimeout(this.searchTimeout);
      console.log('searching...');
    }
  }

  ngOnInit() {

  }
}