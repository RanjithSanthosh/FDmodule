import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHistory } from './customer-history';

describe('CustomerHistory', () => {
  let component: CustomerHistory;
  let fixture: ComponentFixture<CustomerHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
