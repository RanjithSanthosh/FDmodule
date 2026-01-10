import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntPayment } from './int-payment';

describe('IntPayment', () => {
  let component: IntPayment;
  let fixture: ComponentFixture<IntPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
