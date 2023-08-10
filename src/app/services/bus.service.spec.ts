import { BusService } from "./bus.service";
import { TestBed } from "@angular/core/testing";

describe("BusService", () => {

  let service: BusService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BusService
      ]
    });
    service = TestBed.get(BusService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
