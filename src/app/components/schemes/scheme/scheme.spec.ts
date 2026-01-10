import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scheme } from './scheme';

describe('Scheme', () => {
  let component: Scheme;
  let fixture: ComponentFixture<Scheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
