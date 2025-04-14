import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetBlogDetailComponent } from './vet-blog-detail.component';

describe('VetBlogDetailComponent', () => {
  let component: VetBlogDetailComponent;
  let fixture: ComponentFixture<VetBlogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetBlogDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetBlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
