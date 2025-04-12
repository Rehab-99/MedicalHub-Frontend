import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanClinicComponent } from './human-clinic.component';

describe('HumanClinicComponent', () => {
  let component: HumanClinicComponent;
  let fixture: ComponentFixture<HumanClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanClinicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
