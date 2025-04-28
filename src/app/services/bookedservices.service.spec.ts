import { TestBed } from '@angular/core/testing';

import { BookedservicesService } from './bookedservices.service';

describe('BookedservicesService', () => {
  let service: BookedservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
