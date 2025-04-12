import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVetClinicComponent } from './edit-vet-clinic.component';

describe('EditVetClinicComponent', () => {
  let component: EditVetClinicComponent;
  let fixture: ComponentFixture<EditVetClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVetClinicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVetClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
