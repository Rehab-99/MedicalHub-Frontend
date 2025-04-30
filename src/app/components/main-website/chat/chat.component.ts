import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class ChatComponent {
  isOpen = false;
  messages: { text: string; isUser: boolean }[] = [];
  quickQuestions = [
    'How do I book an appointment?',
    'What types of doctors are available?',
    'How can I find a clinic?',
    'What medical services do you offer?',
    'How do I contact a doctor?'
  ];

  // Font Awesome icons
  faComments = faComments;
  faTimes = faTimes;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage(message: string) {
    this.messages.push({ text: message, isUser: true });
    // Simulate response
    setTimeout(() => {
      this.messages.push({ 
        text: this.getResponse(message), 
        isUser: false 
      });
    }, 1000);
  }

  private getResponse(message: string): string {
    const responses: { [key: string]: string } = {
      'How do I book an appointment?': 'You can book an appointment in three ways: 1) Click the "Book Appointment" button on any doctor\'s profile 2) Visit the Appointment page from the main menu 3) Call our reception at 123456789. You can also book specific medical services directly from the Services page.',
      'What types of doctors are available?': 'We have two main categories of doctors: 1) Human Doctors - Specialists in various medical fields 2) Veterinary Doctors - For your pets. You can browse all doctors by clicking "Doctors" in the main menu and selecting your preferred category.',
      'How can I find a clinic?': 'You can find clinics in two ways: 1) Visit the "Clinics" page from the main menu 2) Browse clinics through doctor profiles. We have both human clinics and veterinary clinics available. Each clinic has its own team of specialized doctors.',
      'What medical services do you offer?': 'We offer a wide range of medical services including: 1) General check-ups 2) Specialized treatments 3) Emergency care 4) Dental services 5) Veterinary services. You can view all services and their prices on our Services page.',
      'How do I contact a doctor?': 'You can contact doctors in several ways: 1) Book an appointment through their profile 2) Visit their clinic directly 3) Call the clinic phone number listed on their profile. Each doctor\'s contact information is available on their profile page.'
    };
    return responses[message] || 'I apologize, but I don\'t have information about that. Please contact our support team for assistance.';
  }
} 