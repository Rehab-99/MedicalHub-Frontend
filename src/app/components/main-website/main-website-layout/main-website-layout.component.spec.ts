import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWebsiteLayoutComponent } from './main-website-layout.component';

describe('MainWebsiteLayoutComponent', () => {
  let component: MainWebsiteLayoutComponent;
  let fixture: ComponentFixture<MainWebsiteLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainWebsiteLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainWebsiteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
