import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditVetCategoryComponent } from './edit-vet-category.component';
import { VetCategoryService } from '../../../services/vet-category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('EditVetCategoryComponent', () => {
  let component: EditVetCategoryComponent;
  let fixture: ComponentFixture<EditVetCategoryComponent>;
  let vetCategoryService: jasmine.SpyObj<VetCategoryService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: { snapshot: { paramMap: { get: jasmine.Spy } } };

  const mockCategory = {
    id: 1,
    name: 'Test Category',
    description: 'Test Description',
    image: 'test-image.jpg'
  };

  beforeEach(async () => {
    const vetCategoryServiceSpy = jasmine.createSpyObj('VetCategoryService', ['getCategory', 'updateCategory']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [EditVetCategoryComponent],
      imports: [FormsModule],
      providers: [
        { provide: VetCategoryService, useValue: vetCategoryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    vetCategoryService = TestBed.inject(VetCategoryService) as jasmine.SpyObj<VetCategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as any;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load category data on init', fakeAsync(() => {
    vetCategoryService.getCategory.and.returnValue(of(mockCategory));
    component.ngOnInit();
    tick();

    expect(component.category).toEqual(mockCategory);
    expect(vetCategoryService.getCategory).toHaveBeenCalledWith(1);
  }));

  it('should handle error when loading category', fakeAsync(() => {
    const error = new Error('Failed to load category');
    vetCategoryService.getCategory.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.ngOnInit();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to load category',
      icon: 'error'
    });
  }));

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    component.onFileSelected(mockEvent);
    expect(component.selectedFile).toEqual(mockFile);
  });

  it('should handle form submission successfully', fakeAsync(() => {
    const mockFormData = new FormData();
    mockFormData.append('name', 'Updated Category');
    mockFormData.append('description', 'Updated Description');
    mockFormData.append('image', new File([''], 'test.jpg'));

    vetCategoryService.updateCategory.and.returnValue(of(mockCategory));
    spyOn(Swal, 'fire');

    component.category = { ...mockCategory };
    component.selectedFile = new File([''], 'test.jpg');
    component.onSubmit();
    tick();

    expect(vetCategoryService.updateCategory).toHaveBeenCalledWith(1, jasmine.any(FormData));
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Success!',
      text: 'Category updated successfully',
      icon: 'success'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/vet-categories']);
  }));

  it('should handle form submission error', fakeAsync(() => {
    const error = new Error('Failed to update category');
    vetCategoryService.updateCategory.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.category = { ...mockCategory };
    component.onSubmit();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to update category',
      icon: 'error'
    });
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/vet-categories']);
  });

  it('should validate required fields', () => {
    component.category = {
      id: 1,
      name: '',
      description: '',
      image: ''
    };
    component.submitted = true;
    fixture.detectChanges();

    const nameError = fixture.nativeElement.querySelector('.validation-error');
    expect(nameError.textContent).toContain('Category name is required');
  });
}); 