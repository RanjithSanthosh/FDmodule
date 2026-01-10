import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositHistory } from './deposit-history';

describe('DepositHistory', () => {
  let component: DepositHistory;
  let fixture: ComponentFixture<DepositHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
