import { BookedServiceComponent } from './bookedservice/bookedservice.component';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { PatientHistoryTableComponent } from './patient-history-table/patient-history-table.component';
import { UserOrdersComponent } from '../user-orders/user-orders.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    MainHeaderComponent,
    PatientDetailsComponent,
    PatientVitalsComponent,
    PatientHistoryTableComponent,
    UserOrdersComponent,
    BookedServiceComponent
   
  ]
})
export class UserDashboardComponent implements OnInit {
  isRootRoute: boolean = true;
  isOrdersRoute: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isRootRoute = event.urlAfterRedirects === '/user/dashboard' || event.urlAfterRedirects === '/user/dashboard/';
      this.isOrdersRoute = event.urlAfterRedirects === '/user/dashboard/orders';
    });

    this.isRootRoute = this.router.url === '/user/dashboard' || this.router.url === '/user/dashboard/';
    this.isOrdersRoute = this.router.url === '/user/dashboard/orders';
  }
}
