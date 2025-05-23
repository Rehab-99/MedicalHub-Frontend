import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetComponent } from './vet.component';

describe('VetComponent', () => {
  let component: VetComponent;
  let fixture: ComponentFixture<VetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
