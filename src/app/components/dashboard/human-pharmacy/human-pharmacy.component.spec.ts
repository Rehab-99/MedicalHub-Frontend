import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanPharmacyComponent } from './human-pharmacy.component';

describe('HumanPharmacyComponent', () => {
  let component: HumanPharmacyComponent;
  let fixture: ComponentFixture<HumanPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanPharmacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
