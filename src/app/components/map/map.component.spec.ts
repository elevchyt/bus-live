import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MapComponent } from "./map.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("MapComponent", () => {

  let fixture: ComponentFixture<MapComponent>;
  let component: MapComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [MapComponent]
    });

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
