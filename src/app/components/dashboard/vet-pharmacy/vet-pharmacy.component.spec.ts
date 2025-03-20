import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetPharmacyComponent } from './vet-pharmacy.component';

describe('VetPharmacyComponent', () => {
  let component: VetPharmacyComponent;
  let fixture: ComponentFixture<VetPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetPharmacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
