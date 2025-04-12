import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: jasmine.SpyObj<Router>;

  const mockCategories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' }
  ];

  const mockProductResponse = {
    status: 201,
    message: 'Product created successfully',
    data: {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: '25',
      stock: '100',
      category_id: '1',
      image: 'products/test.jpg',
      created_at: '2024-03-20T12:00:00.000000Z',
      updated_at: '2024-03-20T12:00:00.000000Z'
    }
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['createProduct']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CreateProductComponent],
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', fakeAsync(() => {
    categoryService.getCategories.and.returnValue(of({ data: mockCategories }));
    component.ngOnInit();
    tick();

    expect(component.categories).toEqual(mockCategories);
    expect(categoryService.getCategories).toHaveBeenCalled();
  }));

  it('should handle error when loading categories', fakeAsync(() => {
    const error = new Error('Failed to load categories');
    categoryService.getCategories.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.ngOnInit();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to load categories',
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
    expect(component.product.image).toEqual(mockFile);
  });

  it('should validate required fields', () => {
    component.submitted = true;
    fixture.detectChanges();

    const nameError = fixture.nativeElement.querySelector('.validation-error');
    expect(nameError.textContent).toContain('Product name is required');
  });

  it('should create product successfully', fakeAsync(() => {
    // Setup form data
    component.product = {
      name: 'Test Product',
      description: 'Test Description',
      price: '25',
      stock: '100',
      category_id: '1',
      image: null
    };

    productService.createProduct.and.returnValue(of(mockProductResponse));
    spyOn(Swal, 'fire');

    component.onSubmit();
    tick();

    expect(productService.createProduct).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Success!',
      text: 'Product created successfully',
      icon: 'success'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/products']);
  }));

  it('should handle error when creating product', fakeAsync(() => {
    const error = new Error('Failed to create product');
    productService.createProduct.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.product = {
      name: 'Test Product',
      description: 'Test Description',
      price: '25',
      stock: '100',
      category_id: '1',
      image: null
    };

    component.onSubmit();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to create product',
      icon: 'error'
    });
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/products']);
  });

  it('should not submit form if required fields are missing', () => {
    component.submitted = true;
    component.onSubmit();

    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('should handle form submission with image', fakeAsync(() => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.selectedFile = mockFile;
    component.product = {
      name: 'Test Product',
      description: 'Test Description',
      price: '25',
      stock: '100',
      category_id: '1',
      image: mockFile
    };

    productService.createProduct.and.returnValue(of(mockProductResponse));
    spyOn(Swal, 'fire');

    component.onSubmit();
    tick();

    expect(productService.createProduct).toHaveBeenCalled();
    const formData = productService.createProduct.calls.first().args[0];
    expect(formData instanceof FormData).toBeTrue();
    expect(formData.get('image')).toEqual(mockFile);
  }));
}); 