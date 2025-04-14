import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VetCategoryComponent } from './vet-category.component';
import { VetCategoryService } from '../../../services/vet-category.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('VetCategoryComponent', () => {
  let component: VetCategoryComponent;
  let fixture: ComponentFixture<VetCategoryComponent>;
  let vetCategoryService: jasmine.SpyObj<VetCategoryService>;

  const mockCategories = {
    data: [
      {
        id: 1,
        name: 'Test Category 1',
        description: 'Test Description 1',
        image: 'test1.jpg'
      },
      {
        id: 2,
        name: 'Test Category 2',
        description: 'Test Description 2',
        image: 'test2.jpg'
      }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('VetCategoryService', ['getCategories', 'deleteCategory']);
    spy.getCategories.and.returnValue(of(mockCategories));
    spy.deleteCategory.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        VetCategoryComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: VetCategoryService, useValue: spy }
      ]
    }).compileComponents();

    vetCategoryService = TestBed.inject(VetCategoryService) as jasmine.SpyObj<VetCategoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(vetCategoryService.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories.data);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading categories', () => {
    vetCategoryService.getCategories.and.returnValue(throwError(() => new Error('Test error')));
    const swalSpy = spyOn(Swal, 'fire');

    component.loadCategories();

    expect(component.loading).toBeFalse();
    expect(swalSpy).toHaveBeenCalledWith({
      title: 'Error!',
      text: 'Failed to load categories',
      icon: 'error'
    });
  });

  it('should navigate to add category page', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.navigateToAddCategory();

    expect(routerSpy).toHaveBeenCalledWith(['/dashboard/add-vet-category']);
  });

  it('should navigate to edit category page', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const category = { id: 1, name: 'Test' };

    component.editCategory(category);

    expect(routerSpy).toHaveBeenCalledWith(['/dashboard/edit-vet-category', category.id]);
  });

  it('should delete category when confirmed', async () => {
    const swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }));
    const category = { id: 1, name: 'Test' };

    await component.deleteCategory(category);

    expect(vetCategoryService.deleteCategory).toHaveBeenCalledWith(category.id);
    expect(swalFireSpy).toHaveBeenCalledTimes(2); // Once for confirmation, once for success
  });

  it('should not delete category when not confirmed', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false }));
    const category = { id: 1, name: 'Test' };

    await component.deleteCategory(category);

    expect(vetCategoryService.deleteCategory).not.toHaveBeenCalled();
  });

  it('should handle error when deleting category', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }));
    vetCategoryService.deleteCategory.and.returnValue(throwError(() => new Error('Test error')));
    const category = { id: 1, name: 'Test' };

    await component.deleteCategory(category);

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error!',
      'Failed to delete category.',
      'error'
    );
  });
}); 