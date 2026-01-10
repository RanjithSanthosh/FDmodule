import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositSummary } from './deposit-summary';

describe('DepositSummary', () => {
  let component: DepositSummary;
  let fixture: ComponentFixture<DepositSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
