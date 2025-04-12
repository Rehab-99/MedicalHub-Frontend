import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VetProductsComponent } from './vet-products.component';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('VetProductsComponent', () => {
  let component: VetProductsComponent;
  let fixture: ComponentFixture<VetProductsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;

  const mockProducts = [
    {
      id: 1,
      name: 'Test Vet Product 1',
      description: 'Test Vet Description 1',
      price: 100,
      stock: 10,
      image: 'test1.jpg'
    },
    {
      id: 2,
      name: 'Test Vet Product 2',
      description: 'Test Vet Description 2',
      price: 200,
      stock: 20,
      image: 'test2.jpg'
    }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [VetProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VetProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    productService.getProducts.and.returnValue(of({ data: mockProducts }));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.products).toEqual(mockProducts);
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should handle error when loading products', () => {
    const error = new Error('Test error');
    productService.getProducts.and.returnValue(throwError(() => error));
    spyOn(Swal, 'fire');

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.products).toEqual([]);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to load products',
      icon: 'error'
    });
  });

  it('should navigate to add product page', () => {
    component.navigateToAddProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/add-vet-product']);
  });

  it('should navigate to edit product page', () => {
    const product = mockProducts[0];
    component.editProduct(product);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/edit-vet-product', product.id]);
  });

  it('should delete product when confirmed', () => {
    const product = mockProducts[0];
    component.products = [...mockProducts];
    productService.deleteProduct.and.returnValue(of({}));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }));

    component.deleteProduct(product);

    expect(productService.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(component.products.length).toBe(1);
    expect(component.products[0].id).toBe(2);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Deleted!',
      text: `${product.name} has been deleted successfully.`,
      icon: 'success'
    });
  });

  it('should handle error when deleting product', () => {
    const product = mockProducts[0];
    component.products = [...mockProducts];
    productService.deleteProduct.and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }));

    component.deleteProduct(product);

    expect(productService.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(component.products.length).toBe(2);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to delete product. Please try again.',
      icon: 'error'
    });
  });

  it('should not delete product when not confirmed', () => {
    const product = mockProducts[0];
    component.products = [...mockProducts];
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false }));

    component.deleteProduct(product);

    expect(productService.deleteProduct).not.toHaveBeenCalled();
    expect(component.products.length).toBe(2);
  });
}); 