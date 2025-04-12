import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddVetCategoryComponent } from './add-vet-category.component';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('AddVetCategoryComponent', () => {
  let component: AddVetCategoryComponent;
  let fixture: ComponentFixture<AddVetCategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['createCategory']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddVetCategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVetCategoryComponent);
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
      type: 'vet'
    });
  });

  it('should call categoryService.createCategory and show success message on successful submission', () => {
    const mockResponse = { success: true };
    categoryService.createCategory.and.returnValue(of(mockResponse));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({}));

    component.category = {
      name: 'Test Vet Category',
      description: 'Test Description',
      image: 'test-image.jpg',
      type: 'vet'
    };

    component.onSubmit();

    expect(categoryService.createCategory).toHaveBeenCalledWith(component.category);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Success!',
      text: 'Vet Category created successfully',
      icon: 'success'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed submission', () => {
    const mockError = { error: { message: 'Test error' } };
    categoryService.createCategory.and.returnValue(throwError(() => mockError));
    spyOn(Swal, 'fire');

    component.category = {
      name: 'Test Vet Category',
      description: 'Test Description',
      image: 'test-image.jpg',
      type: 'vet'
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