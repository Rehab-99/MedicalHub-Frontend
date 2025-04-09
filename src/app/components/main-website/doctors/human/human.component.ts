// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DoctorService } from '../../../../services/doctor.service';


// @Component({
//   selector: 'app-human',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './human.component.html',
//   styleUrls: ['./human.component.css']
// })
// export class HumanComponent implements OnInit {
//   doctors: any[] = [];

//   constructor(private doctorService: DoctorService) {}
//   trackDoctor(index: number, doc: any): number {
//     return doc.id;  // Make sure `id` is unique for each doctor
//   }
  
//   ngOnInit(): void {
//     this.doctorService.getHumanDoctors().subscribe(response => {
//       this.doctors = response.data;
//     });
//   }
// }
