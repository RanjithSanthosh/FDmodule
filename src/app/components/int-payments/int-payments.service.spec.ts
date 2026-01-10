import { TestBed } from '@angular/core/testing';

import { IntPaymentsService } from './int-payments.service';

describe('IntPaymentsService', () => {
  let service: IntPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
