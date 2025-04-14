import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule for the download link (even if href="#" for now)

@Component({
  selector: 'app-patient-history-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-history-table.component.html',
  styleUrl: './patient-history-table.component.scss'
})
export class PatientHistoryTableComponent {

} 