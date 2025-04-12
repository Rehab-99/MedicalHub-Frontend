import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBlogListComponent } from './human-blog-list.component';

describe('HumanBlogListComponent', () => {
  let component: HumanBlogListComponent;
  let fixture: ComponentFixture<HumanBlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBlogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanBlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
