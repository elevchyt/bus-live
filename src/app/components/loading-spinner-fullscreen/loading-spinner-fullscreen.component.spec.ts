import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoadingSpinnerFullscreenComponent } from "./loading-spinner-fullscreen.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("LoadingSpinnerFullscreenComponent", () => {

  let fixture: ComponentFixture<LoadingSpinnerFullscreenComponent>;
  let component: LoadingSpinnerFullscreenComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [LoadingSpinnerFullscreenComponent]
    });

    fixture = TestBed.createComponent(LoadingSpinnerFullscreenComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
