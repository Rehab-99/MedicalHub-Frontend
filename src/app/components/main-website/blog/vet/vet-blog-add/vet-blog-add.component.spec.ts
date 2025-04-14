import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetBlogAddComponent } from './vet-blog-add.component';

describe('VetBlogAddComponent', () => {
  let component: VetBlogAddComponent;
  let fixture: ComponentFixture<VetBlogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetBlogAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetBlogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
