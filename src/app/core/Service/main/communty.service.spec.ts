import { TestBed } from '@angular/core/testing';

import { CommuntyService } from './communty.service';

describe('CommuntyService', () => {
  let service: CommuntyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommuntyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
