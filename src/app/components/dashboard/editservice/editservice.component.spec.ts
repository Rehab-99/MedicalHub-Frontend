import { EditServiceComponent } from './editservice.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('EditserviceComponent', () => {
  let component: EditServiceComponent;
  let fixture: ComponentFixture<EditserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
