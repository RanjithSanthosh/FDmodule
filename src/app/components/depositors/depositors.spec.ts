import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Depositors } from './depositors';

describe('Depositors', () => {
  let component: Depositors;
  let fixture: ComponentFixture<Depositors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Depositors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Depositors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
