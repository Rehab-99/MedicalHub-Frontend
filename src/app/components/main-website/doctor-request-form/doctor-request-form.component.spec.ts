import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRequestFormComponent } from './doctor-request-form.component';

describe('DoctorRequestFormComponent', () => {
  let component: DoctorRequestFormComponent;
  let fixture: ComponentFixture<DoctorRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
