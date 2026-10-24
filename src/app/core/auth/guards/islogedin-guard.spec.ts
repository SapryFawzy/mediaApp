import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { islogedinGuard } from './islogedin-guard';

describe('islogedinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => islogedinGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
