import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedservicesComponent } from './bookedservices.component';

describe('BookedservicesComponent', () => {
  let component: BookedservicesComponent;
  let fixture: ComponentFixture<BookedservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
