import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditCategoryComponent } from './edit-category.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('EditCategoryComponent', () => {
  let component: EditCategoryComponent;
  let fixture: ComponentFixture<EditCategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: jasmine.SpyObj<Router>;

  const mockCategory = {
    id: 1,
    name: 'Test Category',
    description: 'Test Description',
    image: 'test-image.jpg'
  };

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategory', 'updateCategory']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = { snapshot: { params: { id: '1' } } };

    await TestBed.configureTestingModule({
      declarations: [EditCategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load category on init', fakeAsync(() => {
    const mockResponse = { data: mockCategory };
    categoryService.getCategory.and.returnValue(of(mockResponse));

    component.ngOnInit();
    tick();

    expect(component.category).toEqual(mockCategory);
    expect(component.imagePreview).toBe(`http://127.0.0.1:8000/storage/${mockCategory.image}`);
    expect(component.loading).toBeFalse();
  }));

  it('should handle error when loading category', fakeAsync(() => {
    const error = new Error('Failed to load category');
    categoryService.getCategory.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.ngOnInit();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to load category',
      icon: 'error'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/human-category']);
  }));

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toBe(mockFile);
    expect(component.imagePreview).toBeTruthy();
  });

  it('should not submit form if name or description is empty', () => {
    component.submitted = true;
    component.category.name = '';
    component.category.description = '';

    component.onSubmit();

    expect(categoryService.updateCategory).not.toHaveBeenCalled();
  });

  it('should submit form successfully', fakeAsync(() => {
    const mockFormData = new FormData();
    const mockResponse = { success: true };
    
    component.category = mockCategory;
    component.selectedFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    categoryService.updateCategory.and.returnValue(of(mockResponse));
    spyOn(Swal, 'fire');

    component.onSubmit();
    tick();

    expect(categoryService.updateCategory).toHaveBeenCalledWith(mockCategory.id, jasmine.any(FormData));
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Success!',
      text: 'Category updated successfully',
      icon: 'success'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/human-category']);
  }));

  it('should handle error when updating category', fakeAsync(() => {
    const error = { error: { message: 'Update failed' } };
    component.category = mockCategory;
    categoryService.updateCategory.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.onSubmit();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Update failed',
      icon: 'error'
    });
  }));

  it('should navigate back on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/human-category']);
  });
}); 