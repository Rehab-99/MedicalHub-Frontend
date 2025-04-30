import { Component } from '@angular/core';
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
import { SettingsComponent as AdminSettingsComponent } from './components/dashboard/settings/settings.component';
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
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SearchComponent } from './components/main-website/search/search.component';


import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { MainWebsiteLayoutComponent } from './components/main-website/main-website-layout/main-website-layout.component';
import { AboutPageComponent } from './components/main-website/about/about-page/about-page.component';
import { ServiceDetailComponent } from './components/main-website/services/service-detail/service-detail.component';
import { DoctorListComponent } from './components/main-website/doctors/doctor-list/doctor-list.component';
import { DoctorDetailComponent } from './components/main-website/doctors/doctor-detail/doctor-detail.component';
import { BlogListComponent } from './components/main-website/blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/main-website/blog/blog-detail/blog-detail.component';
import { ContactPageComponent } from './components/main-website/contact/contact-page/contact-page.component';
// import { AppointmentFormComponent } from './components/main-website/appointments/appointment-form/appointment-form.component';
import { ProfileComponent } from './components/main-website/profile/profile.component';
import { VetComponent } from './components/main-website/doctors/vet/vet.component';
import { HumanComponent } from './components/main-website/doctors/human/human.component';
import { ClinicsComponent } from './components/main-website/clinics/clinics.component';
import { ClinicDoctorsComponent } from './components/main-website/clinics/clinic-doctors/clinic-doctors.component';
import { VetBlogListComponent } from './components/main-website/blog/vet/vet-blog-list/vet-blog-list.component';
import { HumanBlogDetailComponent } from './components/main-website/blog/human/human-blog-detail/human-blog-detail.component';
import { VetBlogDetailComponent } from './components/main-website/blog/vet/vet-blog-detail/vet-blog-detail.component';
import { HumanBlogListComponent } from './components/main-website/blog/human/human-blog-list/human-blog-list.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { SettingsComponent as UserSettingsComponent } from './components/settings/settings.component';
import { HumanCategoryComponent } from './components/dashboard/human-category/human-category.component';
import { VetCategoryComponent } from './components/dashboard/vet-category/vet-category.component';
import { AddCategoryComponent } from './components/dashboard/add-category/add-category.component';
import { EditCategoryComponent } from './components/dashboard/edit-category/edit-category.component';
import { HumanProductsComponent } from './components/dashboard/human-products/human-products.component';
import { VetProductsComponent } from './components/dashboard/vet-products/vet-products.component';
import { AddProductComponent } from './components/dashboard/add-product/add-product.component';
import { EditProductComponent } from './components/dashboard/edit-product/edit-product.component';
import { BookComponent } from './components/main-website/services/book/book.component';
import { ServicesComponent } from './components/dashboard/services/services.component';
import { AddservicesComponent } from './components/dashboard/addservices/addservices.component';
import { EditServiceComponent } from './components/dashboard/editservice/editservice.component';

import { EditPostBlogComponent } from './components/dashboard/edit-post-blog/edit-post-blog.component';
import { DoctorLoginComponent } from './doctor-dashboard/doctor-login/doctor-login.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard/doctor-dashboard.component';

import { HumanPharmacyComponent as MainWebsiteHumanPharmacyComponent } from './components/main-website/pharmacy/human-pharmacy/human-pharmacy.component';
import { VetPharmacyComponent as MainWebsiteVetPharmacyComponent } from './components/main-website/pharmacy/vet-pharmacy/vet-pharmacy.component';
import { AppointmentComponent } from './components/main-website/appointment/appointment.component';
import { CategoryProductsComponent } from './components/main-website/category-products/category-products.component';

import { DoctorRequestFormComponent } from './components/main-website/doctor-request-form/doctor-request-form.component';
import { DoctorRequestComponent } from './components/dashboard/doctor-request/doctor-request.component';
import { FeedbackComponent } from './components/main-website/feedback/feedback.component';

import { AddPostComponent } from './doctor-dashboard/add-post/add-post.component';
import { DoctorBlogComponent } from './doctor-dashboard/doctor-blog/doctor-blog.component';
import { CommentsComponent } from './components/main-website/comments/comments.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { DoctorProfileComponent } from './doctor-dashboard/doctor-profile/doctor-profile.component';
import { DoctorProfileEditComponent } from './doctor-dashboard/doctor-profile-edit/doctor-profile-edit.component';
import { DoctorAppointmentComponent } from './doctor-dashboard/doctor-appointment/doctor-appointment.component';
import { DoctorPatientDetailComponent } from './doctor-dashboard/doctor-patient-detail/doctor-patient-detail.component';
import { DoctorPatientComponent } from './doctor-dashboard/doctor-patient/doctor-patient.component';
import { DoctorReportsComponent } from './doctor-dashboard/doctor-reports/doctor-reports.component';
import { BookedServicesComponent } from './components/dashboard/bookedservices/bookedservices.component';
import { OrdersComponent } from './components/dashboard/orders/orders.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { CouponsComponent } from './components/dashboard/coupons/coupons.component';

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
  { 
    path: 'doctors/vet',
    component: VetComponent 
  },
  { 
    path: 'doctors/human',
    component: HumanComponent 
  },
  { 
    path: 'clinics',
    component: ClinicsComponent 
  },
  { 
    path: 'clinics/:id/doctors',
    component: ClinicDoctorsComponent 
  },
  
  {
    path: 'services',
    component: ServiceDetailComponent
  },
 
  {
    path: 'book/:id',
    component: BookComponent
  },
  {
     path:'appointment',

     component:AppointmentComponent
  },
  {
    path:'doctor-request',
    component:DoctorRequestFormComponent
  },
  { path: 'appointment/:doctorId',
     component: AppointmentComponent },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'password/update/:token',
    component: UpdatePasswordComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent
      },
      {
        path: 'edit-category/:id',
        component: EditCategoryComponent
      },
      {
        path: 'add-category',
        component: AddCategoryComponent
      },
      {
        path:"doctor-request",
        component:DoctorRequestComponent
      },
      {
        path: 'human-categories',
        component: HumanCategoryComponent
      },
      {
        path: 'vet-categories',
        component: VetCategoryComponent
      },
      {
        path: 'human-pharmacy',
        component: HumanPharmacyComponent
      },
      {
        path: 'human-clinic',
        component: HumanClinicComponent
      },
      { 
        path: 'bookedservices',
        component: BookedServicesComponent
      },
      { 
        path: 'add-clinic', 
        component: AddClinicComponent 
      }, 
      { 
        path: 'edit-clinic/:id', 
        component: EditClinicComponent 
      },
      {
        path: 'human-blog',
        component: HumanBlogComponent
      },
      {
        path: 'vet-clinic',
        component: VetClinicComponent
      },
      { 
        path: 'add-vet-clinic',
        component: AddVetClinicComponent 
      },
      { 
        path: 'edit-vet-clinic/:id', 
        component: EditVetClinicComponent 
      },
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
      {
        path: 'addservice',
        component: AddservicesComponent
      },
      {
          path:'editservice/:id'
          ,component:EditServiceComponent
      },
      { 
        path: 'add-doctor', 
        component: AddDoctorComponent 
      },
      { 
        path: 'edit-doctor/:id',
        component: EditDoctorComponent 
      }, 
      {
        path: 'appointments',
        component: AppointmentsComponent
      },
      {
        path: 'consultations',
        component: ConsultationsComponent
      },
      {
        path:'services',
        component: ServicesComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'settings',
        component: AdminSettingsComponent
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
        path: 'add-product',
        component: AddProductComponent,
        data: { title: 'Add Product' }
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'coupons',
        component: CouponsComponent
      }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'blog/vet', 
    component: VetBlogListComponent
  },
  { 
    path: 'blog/vet/:id', 
    component: VetBlogDetailComponent 
  }, 
  { 
    path: 'blog/human', 
    component: HumanBlogListComponent
  },
 
  { 
    path: 'blog/human/:id', 
    component: HumanBlogDetailComponent 
  },
  
  { 
    path: 'services', 
    component: ServiceDetailComponent 
  },
  { 
    path: '', 
    redirectTo: '/blog/vet', 
    pathMatch: 'full' 
  },
  {
    path: "edit-blog/:id",
    component: EditPostBlogComponent
  },
  {
    path: "doctor-dashboard",
    component: DoctorDashboardComponent
  },
  {
    path: "doctor-login",
    component: DoctorLoginComponent
  },
  {
    path: 'blog/vet/:id/comments',
    component: CommentsComponent
  },
  {
    path: 'blog/human/:id/comments',
    component: CommentsComponent
  },
  {
    path: "add-post",
    component: AddPostComponent
  },
  { path: 'doctor-blog',
     component: DoctorBlogComponent 
    },
    {
      path: 'doctor-profile',
      component: DoctorProfileComponent
    } ,
    {
      path: 'doctor-profile/edit',
      component: DoctorProfileEditComponent
    },
    { path: 'doctor-patient', 
      component:  DoctorPatientComponent
     },
    { path: 'doctor-patient/:id',
       component: DoctorPatientDetailComponent 
      },
    // أضف هذا المسار إذا لم يكن موجوداً
{
  path: 'doctor-appointments',
  component: DoctorAppointmentComponent
},
{ path: 'doctor-reports', 
  component: DoctorReportsComponent
 },
  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'settings',
        component: UserSettingsComponent
      },
      {
        path:'feedback',
        component:FeedbackComponent
       },
      {
        path:'bookedservice',
        component:BookedServicesComponent
      },
      {
        path: 'orders',
        component: UserOrdersComponent
      }
    ]
  },

  { 
    path: 'pharmacy/human',
    component: MainWebsiteHumanPharmacyComponent 
  },
  { 
    path: 'pharmacy/vet',
    component: MainWebsiteVetPharmacyComponent 
  },
  { path: 'category/:id', 
    component: CategoryProductsComponent 
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent
  },
  {
    path: 'payments/:order/stripe',
    component: PaymentComponent
  },
  {
    path: 'payments/:order/stripe/confirm',
    component: PaymentComponent
  },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path:'search',
    component:SearchComponent
  }
];
