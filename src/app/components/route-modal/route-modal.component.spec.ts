import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RouteModalComponent } from "./route-modal.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("RouteModalComponent", () => {

  let fixture: ComponentFixture<RouteModalComponent>;
  let component: RouteModalComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [RouteModalComponent]
    });

    fixture = TestBed.createComponent(RouteModalComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
