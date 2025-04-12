import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetBlogComponent } from './vet-blog.component';

describe('VetBlogComponent', () => {
  let component: VetBlogComponent;
  let fixture: ComponentFixture<VetBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
