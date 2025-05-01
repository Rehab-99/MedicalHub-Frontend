import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedserviceComponent } from './bookedservice.component';

describe('BookedserviceComponent', () => {
  let component: BookedserviceComponent;
  let fixture: ComponentFixture<BookedserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
