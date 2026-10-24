import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { islogedoutGuard } from './islogedout-guard';

describe('islogedoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => islogedoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
