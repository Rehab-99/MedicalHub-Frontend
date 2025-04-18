import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments',
  imports:[CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(private appointmentService: AppointmentService) {}
 

  ngOnInit(): void {
    this.getAppointments();
  }
  
  getAppointments() {
    console.log('Making request to get appointments...');
    this.appointmentService.getAllAppointments().subscribe({
      next: (res) => {
        console.log('Appointments fetched:', res); // Log response to check
        this.appointments = res;
      },
      error: (err) => {
        console.error('Error fetching appointments:', err); // Log errors if any
        Swal.fire('Error', 'Could not load appointments', 'error');
      }
    });
  }
  
  
}
