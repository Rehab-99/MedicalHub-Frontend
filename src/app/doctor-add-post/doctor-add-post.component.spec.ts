import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAddPostComponent } from './doctor-add-post.component';

describe('DoctorAddPostComponent', () => {
  let component: DoctorAddPostComponent;
  let fixture: ComponentFixture<DoctorAddPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAddPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
