import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './components/dashboard/dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { HumanPharmacyComponent } from './components/dashboard/human-pharmacy/human-pharmacy.component';
import { HumanClinicComponent } from './components/dashboard/human-clinic/human-clinic.component';
import { HumanBlogComponent } from './components/dashboard/human-blog/human-blog.component';
import { VetClinicComponent } from './components/dashboard/vet-clinic/vet-clinic.component';
import { VetPharmacyComponent } from './components/dashboard/vet-pharmacy/vet-pharmacy.component';
import { VetBlogComponent } from './components/dashboard/vet-blog/vet-blog.component';
import { DoctorsComponent } from './components/dashboard/doctors/doctors.component';
import { AppointmentsComponent } from './components/dashboard/appointments/appointments.component';
import { ConsultationsComponent } from './components/dashboard/consultations/consultations.component';
import { UsersComponent } from './components/dashboard/users/users.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { AddDoctorComponent } from './components/dashboard/add-doctor/add-doctor.component';
import { EditDoctorComponent } from './components/dashboard/edit-doctor/edit-doctor.component';
import { EditClinicComponent } from './components/dashboard/edit-clinic/edit-clinic.component';
import { AddClinicComponent } from './components/dashboard/add-clinic/add-clinic.component';
import { AddVetClinicComponent } from './components/dashboard/add-vet-clinic/add-vet-clinic.component';
import { EditVetClinicComponent } from './components/dashboard/edit-vet-clinic/edit-vet-clinic.component';
import { AdminLoginComponent } from './components/auth/admin-login/admin-login.component';
import { UserLoginComponent } from './components/auth/user-login/user-login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { AddCategoryComponent } from './components/dashboard/add-category/add-category.component';
import { EditCategoryComponent } from './components/dashboard/edit-category/edit-category.component';
import { AddVetCategoryComponent } from './components/dashboard/add-vet-category/add-vet-category.component';
import { HumanCategoryComponent } from './components/dashboard/human-category/human-category.component';
import { VetCategoryComponent } from './components/dashboard/vet-category/vet-category.component';
import { EditVetCategoryComponent } from './components/dashboard/edit-vet-category/edit-vet-category.component';
import { HumanProductsComponent } from './components/dashboard/human-products/human-products.component';
import { VetProductsComponent } from './components/dashboard/vet-products/vet-products.component';
import { AddProductComponent } from './components/dashboard/add-product/add-product.component';
import { EditProductComponent } from './components/dashboard/edit-product/edit-product.component';

export const routes: Routes = [
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    component: UserLoginComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'human-pharmacy',
        component: HumanPharmacyComponent
      },
      {
        path: 'human-clinic',
        component: HumanClinicComponent
      },
      { path: 'add-clinic', 
        component: AddClinicComponent }, 
      { path: 'edit-clinic/:id', 
        component: EditClinicComponent },
      {
        path: 'human-blog',
        component: HumanBlogComponent
      },
      {
        path: 'vet-clinic',
        component: VetClinicComponent
      },
      { path: 'add-vet-clinic',
         component: AddVetClinicComponent },
      { path: 'edit-vet-clinic/:id', component:
         EditVetClinicComponent },
      {
        path: 'vet-pharmacy',
        component: VetPharmacyComponent
      },
      {
        path: 'vet-blog',
        component: VetBlogComponent
      },
      {
        path: 'doctors',
        component: DoctorsComponent
      },
      { path: 'add-doctor', 
        component: AddDoctorComponent },
      { path: 'edit-doctor/:id',
         component: EditDoctorComponent }, 
      {
        path: 'appointments',
        component: AppointmentsComponent
      },
      {
        path: 'consultations',
        component: ConsultationsComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'human-category',
        component: HumanCategoryComponent
      },
      {
        path: 'add-category',
        component: AddCategoryComponent
      },
      {
        path: 'edit-category/:id',
        component: EditCategoryComponent
      },
      {
        path: 'vet-category',
        component: VetCategoryComponent
      },
      {
        path: 'add-vet-category',
        component: AddVetCategoryComponent
      },
      {
        path: 'edit-vet-category/:id',
        component: EditVetCategoryComponent
      },
      {
        path: 'human-products',
        component: HumanProductsComponent
      },
      {
        path: 'vet-products',
        component: VetProductsComponent
      },
      {
        path: 'products/add',
        component: AddProductComponent
      },
      {
        path: 'products/edit/:id',
        component: EditProductComponent
      },
      {
        path: 'categories/type/human',
        component: HumanCategoryComponent
      },
      {
        path: 'categories/type/vet',
        component: VetCategoryComponent
      }
    ]
  }
];
