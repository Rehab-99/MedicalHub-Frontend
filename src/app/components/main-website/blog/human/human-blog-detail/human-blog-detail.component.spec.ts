import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBlogDetailComponent } from './human-blog-detail.component';

describe('HumanBlogDetailComponent', () => {
  let component: HumanBlogDetailComponent;
  let fixture: ComponentFixture<HumanBlogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBlogDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanBlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
