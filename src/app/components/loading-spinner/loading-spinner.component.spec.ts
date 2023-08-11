import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading-spinner.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("LoadingSpinnerComponent", () => {

  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let component: LoadingSpinnerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [LoadingSpinnerComponent]
    });

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
