import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { RouteModalComponent } from './components/route-modal/route-modal.component';
import { BusService } from './services/bus.service';
import { AnimationUtils } from './utils/animation-utils';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SearchComponent,
    RouteModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [BusService, AnimationUtils],
  bootstrap: [AppComponent],
})
export class AppModule {}
