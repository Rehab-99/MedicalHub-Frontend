import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostBlogComponent } from './edit-post-blog.component';

describe('EditPostBlogComponent', () => {
  let component: EditPostBlogComponent;
  let fixture: ComponentFixture<EditPostBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPostBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
