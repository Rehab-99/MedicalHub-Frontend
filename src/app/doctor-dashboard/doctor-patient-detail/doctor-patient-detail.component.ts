import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-doctor-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctor-patient-detail.component.html',
  styleUrls: ['./doctor-patient-detail.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class DoctorPatientDetailComponent implements OnInit {
  patient: any = null;
  appointments: any[] = [];
  isLoading = false;
  baseUrl = environment.apiUrl;
  showBookingModal = false;
  showNotesModal = false;
  bookingForm: any = {
    appointment_date: '',
    appointment_time: '',
    notes: '',
    status: 'pending',
  };
  notesInput = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private loginDoctorService: LoginDoctorService
  ) {}

  ngOnInit(): void {
    const doctor = this.loginDoctorService.getDoctor();
    if (!doctor || !doctor.id) {
      Swal.fire('Error', 'Unable to load doctor information. Please login again.', 'error');
      this.router.navigate(['/doctor-login']);
      return;
    }

    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.fetchPatientDetails(doctor.id, +patientId);
    } else {
      Swal.fire('Error', 'Invalid patient ID.', 'error');
      this.router.navigate(['/doctor-patient']);
    }
  }

  fetchPatientDetails(doctorId: number, patientId: number) {
    console.log('Fetching patient details for patient ID:', patientId);
    this.isLoading = true;
    this.appointmentService.getDoctorPatients(doctorId).subscribe({
      next: (response: any) => {
        const patients = response.data || response;
        this.patient = patients.find((p: any) => p.id === patientId);
        if (!this.patient) {
          Swal.fire('Error', 'Patient not found.', 'error');
          this.router.navigate(['/doctor-patient']);
          return;
        }

        this.appointmentService.getDoctorAppointments(doctorId).subscribe({
          next: (apptResponse: any) => {
            this.appointments = (apptResponse.data || apptResponse).filter(
              (appt: any) => appt.user_id === patientId
            );
            console.log('Appointments for patient:', this.appointments);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching appointments:', error);
            Swal.fire('Error', 'Failed to load appointments. Please try again.', 'error');
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error fetching patient:', error);
        Swal.fire('Error', 'Failed to load patient details. Please try again.', 'error');
        this.isLoading = false;
      },
    });
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/80';
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  openBookingModal() {
    this.showBookingModal = true;
  }

  closeBookingModal() {
    this.showBookingModal = false;
    this.bookingForm = {
      appointment_date: '',
      appointment_time: '',
      notes: '',
      status: 'pending',
    };
  }

  submitBooking() {
    const doctor = this.loginDoctorService.getDoctor();
    if (!doctor || !doctor.id) {
      Swal.fire('Error', 'Doctor not logged in.', 'error');
      return;
    }

    const appointmentData = {
      user_id: this.patient.id,
      doctor_id: doctor.id,
      appointment_date: this.bookingForm.appointment_date,
      appointment_time: this.bookingForm.appointment_time,
      notes: this.bookingForm.notes,
      status: this.bookingForm.status,
    };

    this.appointmentService.bookAppointment(appointmentData).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Appointment booked successfully!', 'success');
        this.closeBookingModal();
        this.fetchPatientDetails(doctor.id, this.patient.id);
      },
      error: (error) => {
        console.error('Error booking appointment:', error);
        Swal.fire('Error', 'Failed to book appointment. Please try again.', 'error');
      },
    });
  }

  openNotesModal() {
    this.notesInput = this.patient.notes || '';
    this.showNotesModal = true;
  }

  closeNotesModal() {
    this.showNotesModal = false;
    this.notesInput = '';
  }

  saveNotes() {
    this.appointmentService.updatePatientNotes(this.patient.id, this.notesInput).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Notes updated successfully!', 'success');
        this.patient.notes = this.notesInput;
        this.closeNotesModal();
      },
      error: (error) => {
        console.error('Error updating notes:', error);
        Swal.fire('Error', 'Failed to update notes. Please try again.', 'error');
      },
    });
  }

  deleteNotes() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the notes for this patient.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.updatePatientNotes(this.patient.id, '').subscribe({
          next: (response) => {
            Swal.fire('Deleted', 'Notes have been deleted.', 'success');
            this.patient.notes = '';
            this.notesInput = '';
            this.closeNotesModal();
          },
          error: (error) => {
            console.error('Error deleting notes:', error);
            Swal.fire('Error', 'Failed to delete notes. Please try again.', 'error');
          },
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/doctor-patient']);
  }
}