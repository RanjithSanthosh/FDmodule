import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntPayments } from './int-payments';

describe('IntPayments', () => {
  let component: IntPayments;
  let fixture: ComponentFixture<IntPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
