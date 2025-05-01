import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { FeedbackService } from '../../services/feedback.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-doctor-reports',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './doctor-reports.component.html',
  styleUrls: ['./doctor-reports.component.css']
})
export class DoctorReportsComponent implements OnInit {
  activeTab: string = 'appointments';
  filterPeriod: string = 'month';
  isLoading: boolean = false;
  patients: any[] = [];
  appointments: any[] = [];
  feedback: any[] = [];
  ageGroups: ('0-18' | '19-30' | '31-50' | '51+')[] = ['0-18', '19-30', '31-50', '51+'];
  
  appointmentStats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    peakHours: string[];
    daily: { date: string; count: number }[];
  } = { total: 0, pending: 0, confirmed: 0, completed: 0, peakHours: [], daily: [] };
  
  patientStats: {
    total: number;
    newPatients: number;
    avgVisits: number;
    activePatients: number;
  } = { total: 0, newPatients: 0, avgVisits: 0, activePatients: 0 };
  
  notesStats: {
    total: number;
    patientsWithoutNotes: number;
    recentNotes: { patientName: string; notes: string; date: Date }[];
  } = { total: 0, patientsWithoutNotes: 0, recentNotes: [] };
  
  demographicStats: {
    ageGroups: { '0-18': number; '19-30': number; '31-50': number; '51+': number };
    gender: { male: number; female: number };
  } = { ageGroups: { '0-18': 0, '19-30': 0, '31-50': 0, '51+': 0 }, gender: { male: 0, female: 0 } };
  
  satisfactionStats: {
    averageRating: number;
    complaints: number;
    bestFeedback: { patientName: string; rating: number; comment: string }[];
    worstFeedback: { patientName: string; rating: number; comment: string }[];
  } = { averageRating: 0, complaints: 0, bestFeedback: [], worstFeedback: [] };

  constructor(
    private appointmentService: AppointmentService,
    private loginDoctorService: LoginDoctorService,
    private feedbackService: FeedbackService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const doctor = this.loginDoctorService.getDoctor();
    if (!doctor || !doctor.id) {
      Swal.fire('Error', 'Please login again.', 'error');
      this.router.navigate(['/doctor-login']);
      return;
    }
    this.fetchData(doctor.id);
  }

  async fetchData(doctorId: number) {
    this.isLoading = true;
    try {
      const [patientsResponse, appointmentsResponse, feedbackResponse] = await Promise.all([
        this.appointmentService.getDoctorPatients(doctorId).toPromise().catch(err => {
          console.error('Error fetching patients:', err);
          return { data: [] };
        }),
        this.appointmentService.getDoctorAppointments(doctorId).toPromise().catch(err => {
          console.error('Error fetching appointments:', err);
          return { data: [] };
        }),
        this.feedbackService.getAllFeedback('doctor', doctorId).toPromise().catch(err => {
          console.error('Error fetching feedback:', err);
          return { data: { data: [] } };
        })
      ]);

      this.patients = Array.isArray(patientsResponse) ? patientsResponse : (patientsResponse?.data || []);
      this.appointments = Array.isArray(appointmentsResponse) ? appointmentsResponse : (appointmentsResponse?.data || []);
      this.feedback = feedbackResponse?.data?.data || [];

      this.calculatePatientStats();
      this.calculateNotesStats();
      this.calculateDemographicStats();
      this.calculateAppointmentStats();
      this.calculateSatisfactionStats();
    } catch (error) {
      console.error('Unexpected error in fetchData:', error);
      Swal.fire('Error', 'Failed to load reports. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  calculateAppointmentStats() {
    const now = new Date();
    const startDate = this.filterPeriod === 'month' ? new Date(now.getFullYear(), now.getMonth(), 1) :
                     this.filterPeriod === 'week' ? new Date(now.setDate(now.getDate() - now.getDay())) :
                     new Date(0);
    
    const filteredAppointments = this.appointments.filter(a => {
      const appointmentDate = new Date(a.appointment_date);
      const isValidDate = !isNaN(appointmentDate.getTime());
      return isValidDate && appointmentDate >= startDate;
    });

    this.appointmentStats.total = filteredAppointments.length;
    this.appointmentStats.pending = filteredAppointments.filter(a => a.status === 'pending').length;
    this.appointmentStats.confirmed = filteredAppointments.filter(a => a.status === 'confirmed').length;
    this.appointmentStats.completed = filteredAppointments.filter(a => a.status === 'completed').length;

    const hours = Array(24).fill(0);
    filteredAppointments.forEach(a => {
      const appointmentDateTime = new Date(`${a.appointment_date}T${a.appointment_time}`);
      const hour = appointmentDateTime.getHours();
      hours[hour]++;
    });
    
    this.appointmentStats.peakHours = hours.map((count, i) => ({ hour: i, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(h => `${h.hour}:00-${h.hour + 1}:00`);

    const dailyMap: Record<string, number> = {};
    filteredAppointments.forEach(a => {
      const dateStr = new Date(a.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
    });
    
    this.appointmentStats.daily = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  calculatePatientStats() {
    const now = new Date();
    const startDate = this.filterPeriod === 'month' ? new Date(now.getFullYear(), now.getMonth(), 1) :
                     this.filterPeriod === 'week' ? new Date(now.setDate(now.getDate() - now.getDay())) :
                     new Date(0);

    this.patientStats.total = this.patients.length;
    this.patientStats.newPatients = this.patients.filter(p => p.appointments_count === 1 && new Date(p.appointments?.[0]?.appointment_date) >= startDate).length;
    this.patientStats.avgVisits = this.patients.reduce((sum, p) => sum + (p.appointments_count || 0), 0) / this.patients.length || 0;
    this.patientStats.activePatients = this.patients.filter(p => 
      p.appointments?.some((a: any) => a.status === 'completed' && new Date(a.appointment_date) >= startDate)
    ).length;
  }

  calculateNotesStats() {
    this.notesStats.total = this.patients.filter(p => p.notes).length;
    this.notesStats.patientsWithoutNotes = this.patients.filter(p => !p.notes).length;
    this.notesStats.recentNotes = this.patients
      .filter(p => p.notes)
      .map(p => ({ patientName: p.name, notes: p.notes, date: new Date() }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }

  calculateDemographicStats() {
    this.patients.forEach(p => {
      const age = p.birth_date ? Math.floor((new Date().getTime() - new Date(p.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;
      const gender: 'male' | 'female' | 'unknown' = p.gender || 'unknown';
      
      if (age <= 18) this.demographicStats.ageGroups['0-18']++;
      else if (age <= 30) this.demographicStats.ageGroups['19-30']++;
      else if (age <= 50) this.demographicStats.ageGroups['31-50']++;
      else this.demographicStats.ageGroups['51+']++;
      
      if (gender === 'male' || gender === 'female') {
        this.demographicStats.gender[gender]++;
      }
    });
  }

  calculateSatisfactionStats() {
    const ratings = this.feedback.filter(f => f.rating).map(f => f.rating);
    this.satisfactionStats.averageRating = ratings.length ? 
      ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length : 0;
    
    this.satisfactionStats.complaints = this.feedback.filter(f => 
      f.comment?.toLowerCase().includes('complaint') || f.rating < 3
    ).length;
    
    this.satisfactionStats.bestFeedback = this.feedback
      .filter(f => f.rating >= 4)
      .map(f => ({ 
        patientName: f.patient_name || 'Anonymous', 
        rating: f.rating, 
        comment: f.comment || 'No comment' 
      }))
      .slice(0, 3);
    
    this.satisfactionStats.worstFeedback = this.feedback
      .filter(f => f.rating <= 2)
      .map(f => ({ 
        patientName: f.patient_name || 'Anonymous', 
        rating: f.rating, 
        comment: f.comment || 'No comment' 
      }))
      .slice(0, 3);
  }

  applyFilter() {
    const doctor = this.loginDoctorService.getDoctor();
    if (doctor && doctor.id) {
      this.fetchData(doctor.id);
    }
  }
}