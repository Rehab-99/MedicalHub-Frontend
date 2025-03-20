import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetClinicComponent } from './vet-clinic.component';

describe('VetClinicComponent', () => {
  let component: VetClinicComponent;
  let fixture: ComponentFixture<VetClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetClinicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
