import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { RouteModalComponent } from './components/route-modal/route-modal.component';
import { BusService } from './services/bus.service';
import { AnimationUtils } from './utils/animation-utils';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SearchComponent,
    RouteModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [BusService, AnimationUtils, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
