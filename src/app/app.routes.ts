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

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main-website/main-website-layout/main-website-layout.component').then(m => m.MainWebsiteLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { 
        path: 'home',
        loadComponent: () => import('./components/main-website/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./components/main-website/about/about-page/about-page.component').then(m => m.AboutPageComponent)
      },
      {
        path: 'services',
        children: [
          { 
            path: '',
            loadComponent: () => import('./components/main-website/services/services-list/services-list.component').then(m => m.ServicesListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./components/main-website/services/service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
          }
        ]
      },
      {
        path: 'doctors',
        children: [
          { 
            path: '',
            loadComponent: () => import('./components/main-website/doctors/doctor-list/doctor-list.component').then(m => m.DoctorListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./components/main-website/doctors/doctor-detail/doctor-detail.component').then(m => m.DoctorDetailComponent)
          }
        ]
      },
      {
        path: 'blog',
        children: [
          { 
            path: '',
            loadComponent: () => import('./components/main-website/blog/blog-list/blog-list.component').then(m => m.BlogListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./components/main-website/blog/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
          }
        ]
      },
      {
        path: 'contact',
        loadComponent: () => import('./components/main-website/contact/contact-page/contact-page.component').then(m => m.ContactPageComponent)
      },
      {
        path: 'appointment',
        loadComponent: () => import('./components/main-website/appointments/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
      }
    ]
  },

  {
    path: 'admin/login',
    component: AdminLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    component: UserLoginComponent
  },
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },
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
         component: AddVetClinicComponent }, // Add route for AddVetClinicComponent
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
      }
    ]
  }
];
