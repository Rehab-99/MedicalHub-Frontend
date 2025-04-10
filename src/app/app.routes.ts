import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './components/dashboard/dashboard-layout/dashboard-layout.component';
import { HomeComponent as DashboardHomeComponent } from './components/dashboard/home/home.component';
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
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UpdatePasswordComponent } from './components/auth/update-password/update-password.component';

import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { MainWebsiteLayoutComponent } from './components/main-website/main-website-layout/main-website-layout.component';
import { AboutPageComponent } from './components/main-website/about/about-page/about-page.component';
import { ServicesListComponent } from './components/main-website/services/services-list/services-list.component';
import { ServiceDetailComponent } from './components/main-website/services/service-detail/service-detail.component';
import { DoctorListComponent } from './components/main-website/doctors/doctor-list/doctor-list.component';
import { DoctorDetailComponent } from './components/main-website/doctors/doctor-detail/doctor-detail.component';
import { BlogListComponent } from './components/main-website/blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/main-website/blog/blog-detail/blog-detail.component';
import { ContactPageComponent } from './components/main-website/contact/contact-page/contact-page.component';
import { AppointmentFormComponent } from './components/main-website/appointments/appointment-form/appointment-form.component';
import { ProfileComponent } from './components/main-website/profile/profile.component';
import { VetComponent } from './components/main-website/doctors/vet/vet.component';
import { HumanComponent } from './components/main-website/doctors/human/human.component';
import { ClinicsComponent } from './components/main-website/clinics/clinics.component';
import { ClinicDoctorsComponent } from './components/main-website/clinic-doctors/clinic-doctors.component';

export const routes: Routes = [
  {
    path: '',
    component: MainWebsiteLayoutComponent
  },
  {
    path: 'login',
    component: UserLoginComponent
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    canActivate: [LoginGuard]
  },
  { path: 'doctors/vet',
     component: VetComponent },
    { path: 'doctors/human',
       component: HumanComponent },
       { path: 'clinics',
        component: ClinicsComponent },
        { path: 'clinic-doctors',
          component: ClinicDoctorsComponent },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'password/update',
    component: UpdatePasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent
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
      }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];
