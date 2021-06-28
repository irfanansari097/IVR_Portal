import { TestBed } from '@angular/core/testing';

import { LearnserviceService } from './pages/examples/uploadivrcontents/learnservice.service';

describe('LearnserviceService', () => {
  let service: LearnserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
