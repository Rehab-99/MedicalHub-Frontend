import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoryComponent } from './add-category.component';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['createCategory']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddCategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.category).toEqual({
      name: '',
      description: '',
      image: '',
      type: 'human'
    });
  });

  it('should call categoryService.createCategory and show success message on successful submission', () => {
    const mockResponse = { success: true };
    categoryService.createCategory.and.returnValue(of(mockResponse));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({}));

    component.category = {
      name: 'Test Category',
      description: 'Test Description',
      image: 'test-image.jpg',
      type: 'human'
    };

    component.onSubmit();

    expect(categoryService.createCategory).toHaveBeenCalledWith(component.category);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Success!',
      text: 'Category created successfully',
      icon: 'success'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed submission', () => {
    const mockError = { error: { message: 'Test error' } };
    categoryService.createCategory.and.returnValue(throwError(() => mockError));
    spyOn(Swal, 'fire');

    component.category = {
      name: 'Test Category',
      description: 'Test Description',
      image: 'test-image.jpg',
      type: 'human'
    };

    component.onSubmit();

    expect(categoryService.createCategory).toHaveBeenCalledWith(component.category);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Test error',
      icon: 'error'
    });
  });

  it('should navigate to dashboard on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
}); 