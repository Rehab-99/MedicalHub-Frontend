import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVetClinicComponent } from './add-vet-clinic.component';

describe('AddVetClinicComponent', () => {
  let component: AddVetClinicComponent;
  let fixture: ComponentFixture<AddVetClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVetClinicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVetClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
