import { TestBed } from '@angular/core/testing';

import { LearnenglishService } from './pages/examples/uploadivrcontents/learnenglish.service';

describe('LearnenglishService', () => {
  let service: LearnenglishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnenglishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
