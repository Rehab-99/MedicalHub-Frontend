import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-doctor-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctor-patient.component.html',
  styleUrls: ['./doctor-patient.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class DoctorPatientComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  isLoading = false;
  baseUrl = environment.apiUrl;
  searchQuery = '';
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  showNotesModal = false;
  selectedPatient: any = null;
  notesInput = '';

  constructor(
    private appointmentService: AppointmentService,
    private loginDoctorService: LoginDoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const doctor = this.loginDoctorService.getDoctor();
    console.log('Doctor from LoginDoctorService:', doctor);
    if (doctor && doctor.id) {
      this.fetchPatients(doctor.id);
    } else {
      Swal.fire('Error', 'Unable to load doctor information. Please login again.', 'error');
      this.router.navigate(['/doctor-login']);
    }
  }

  fetchPatients(doctorId: number) {
    console.log('Fetching patients for doctor ID:', doctorId);
    this.isLoading = true;
    this.appointmentService.getDoctorPatients(doctorId).subscribe({
      next: (response: any) => {
        this.patients = response.data || response;
        this.filterPatients();
        console.log('Patients received:', this.patients);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
        Swal.fire('Error', 'Failed to load patients. Please try again.', 'error');
        this.isLoading = false;
      },
    });
  }

  filterPatients() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(query)
    );
    this.totalPages = Math.ceil(this.filteredPatients.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedPatients(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPatients.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/80';
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  isPatientActive(patient: any): boolean {
    if (!patient.appointments?.length) return false;
    const lastAppointment = new Date(`${patient.appointments[0].appointment_date}T${patient.appointments[0].appointment_time}`);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return lastAppointment >= thirtyDaysAgo;
  }

  openNotesModal(patient: any) {
    this.selectedPatient = patient;
    this.notesInput = patient.notes || '';
    this.showNotesModal = true;
  }

  closeNotesModal() {
    this.showNotesModal = false;
    this.selectedPatient = null;
    this.notesInput = '';
  }

  saveNotes() {
    if (this.selectedPatient) {
      this.appointmentService.updatePatientNotes(this.selectedPatient.id, this.notesInput).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Notes updated successfully!', 'success');
          this.selectedPatient.notes = this.notesInput;
          this.closeNotesModal();
        },
        error: (error) => {
          console.error('Error updating notes:', error);
          Swal.fire('Error', 'Failed to update notes. Please try again.', 'error');
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard']);
  }
}