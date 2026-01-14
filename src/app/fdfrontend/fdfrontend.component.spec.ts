import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FDfrontendComponent } from './fdfrontend.component';

describe('FDfrontendComponent', () => {
  let component: FDfrontendComponent;
  let fixture: ComponentFixture<FDfrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FDfrontendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FDfrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
