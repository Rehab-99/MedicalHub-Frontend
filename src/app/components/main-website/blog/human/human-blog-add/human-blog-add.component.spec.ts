import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBlogAddComponent } from './human-blog-add.component';

describe('HumanBlogAddComponent', () => {
  let component: HumanBlogAddComponent;
  let fixture: ComponentFixture<HumanBlogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBlogAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanBlogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
