import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image?: File | null;
}

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: jasmine.SpyObj<Router>;

  const mockCategories = {
    data: [
      { id: 1, name: 'Category 1', type: 'human' },
      { id: 2, name: 'Category 2', type: 'vet' }
    ]
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['createProduct']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategoriesByType']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = { queryParams: of({ source: 'human' }) };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AddProductComponent
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    categoryService.getCategoriesByType.and.returnValue(of(mockCategories));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const expectedProduct: Product = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: 0,
      image: null
    };
    expect(component.product).toEqual(expectedProduct);
    expect(component.loading).toBeFalse();
    expect(component.submitted).toBeFalse();
    expect(component.selectedFile).toBeNull();
    expect(component.imagePreview).toBeNull();
    expect(component.productType).toBe('human');
  });

  it('should load categories on init', () => {
    expect(categoryService.getCategoriesByType).toHaveBeenCalledWith('human');
    expect(component.categories).toEqual(mockCategories.data);
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toBe(mockFile);
  });

  it('should not submit form if required fields are empty', () => {
    component.submitted = false;
    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('should submit form successfully', fakeAsync(() => {
    const mockResponse = {
      status: 200,
      message: 'Product created successfully',
      data: {
        id: 1,
        name: 'Test Product',
        price: 100,
        stock: 10,
        category_id: 1
      }
    };

    const testProduct: Product = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      category_id: 1,
      image: null
    };
    component.product = testProduct;

    productService.createProduct.and.returnValue(of(mockResponse));

    component.onSubmit();
    tick();

    expect(productService.createProduct).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/human-products']);
  }));

  it('should handle error when submitting form', fakeAsync(() => {
    const mockError = {
      error: {
        message: 'Failed to create product'
      }
    };

    const testProduct: Product = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      category_id: 1,
      image: null
    };
    component.product = testProduct;

    productService.createProduct.and.returnValue(throwError(() => mockError));

    component.onSubmit();
    tick();

    expect(productService.createProduct).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/human-products']);
  });

  it('should handle category loading error', fakeAsync(() => {
    const mockError = {
      error: {
        message: 'Failed to load categories'
      }
    };

    categoryService.getCategoriesByType.and.returnValue(throwError(() => mockError));

    component.ngOnInit();
    tick();

    expect(component.categories).toEqual([]);
  }));
}); 