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
    'How can I join as a doctor?'
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
      'How can I join as a doctor?': 'Join our platform to start your medical career with us! Here\'s how to get started:\n\n' +
                  '1. Click on "Join as Doctor" in the website header\n' +
                  '2. Fill out the registration form with your personal and professional details\n' +
                  '3. Upload your medical license and other required documents\n' +
                  '4. Provide your clinic information and working hours\n' +
                  '5. Submit your application\n\n' +
                  'Benefits of joining our platform:\n' +
                  '- Access to a large patient base\n' +
                  '- Flexible working hours\n' +
                  '- Competitive compensation\n' +
                  '- Professional development opportunities\n' +
                  '- Modern clinic facilities\n' +
                  '- Supportive administrative team\n\n' +
                  'Our team will review your application within 3-5 business days. Once approved, you\'ll receive login credentials to access your doctor dashboard where you can manage appointments, update your profile, and start working with patients.'
    };
    return responses[message] || 'I apologize, but I don\'t have information about that. Please contact our support team for assistance.';
  }
} 