import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBlogComponent } from './human-blog.component';

describe('HumanBlogComponent', () => {
  let component: HumanBlogComponent;
  let fixture: ComponentFixture<HumanBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
