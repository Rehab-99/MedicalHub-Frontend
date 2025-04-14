import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetBlogListComponent } from './vet-blog-list.component';

describe('VetBlogListComponent', () => {
  let component: VetBlogListComponent;
  let fixture: ComponentFixture<VetBlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetBlogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetBlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
