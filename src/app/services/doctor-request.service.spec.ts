import { TestBed } from '@angular/core/testing';

import { DoctorRequestService } from './doctor-request.service';

describe('DoctorRequestService', () => {
  let service: DoctorRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
