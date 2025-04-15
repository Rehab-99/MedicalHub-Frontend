import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVetBlogComponent } from './edit-vet-blog.component';

describe('EditVetBlogComponent', () => {
  let component: EditVetBlogComponent;
  let fixture: ComponentFixture<EditVetBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVetBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVetBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
