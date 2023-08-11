import { ApiService } from "./api.service";
import { TestBed } from "@angular/core/testing";

describe("ApiService", () => {

  let service: ApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService
      ]
    });
    service = TestBed.get(ApiService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
