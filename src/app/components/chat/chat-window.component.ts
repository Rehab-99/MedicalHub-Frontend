import { Component, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="chat-window" *ngIf="isOpen">
    <div class="chat-header">
      <h3>Chat with {{ isDoctor ? 'Patient' : 'Doctor' }} {{ recipientName }}</h3>
      <button class="close-button" (click)="handleClose()">×</button>
    </div>
    <div class="chat-messages" #messagesContainer>
      <div *ngFor="let message of messages" class="message" 
           [ngClass]="{'sent': message.sender_type === (isDoctor ? 'doctor' : 'user'), 
                      'received': message.sender_type === (isDoctor ? 'user' : 'doctor')}">
        <div class="message-content">{{ message.message }}</div>
        <div class="message-time">{{ message.created_at | date:'shortTime' }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" [(ngModel)]="newMessage" placeholder="Type your message..." (keyup.enter)="sendMessage()">
      <button [disabled]="isSending" (click)="sendMessage()">{{ isSending ? 'Sending...' : 'Send' }}</button>
    </div>
    <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
`,
  styles: [`
    .chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      height: 550px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .chat-header {
      padding: 15px 20px;
      background: #0d6efd;
      color: white;
      border-radius: 15px 15px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .chat-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
    }

    .close-button {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }

    .close-button:hover {
      background: rgba(255,255,255,0.3);
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: #f8f9fa;
    }

    .message {
      margin-bottom: 15px;
      padding: 10px 15px;
      border-radius: 18px;
      max-width: 80%;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.sent {
      background: #0d6efd;
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 5px;
    }

    .message.received {
      background: white;
      color: #333;
      margin-right: auto;
      border-bottom-left-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .message-content {
      word-break: break-word;
      line-height: 1.4;
    }

    .message-time {
      font-size: 0.75em;
      opacity: 0.7;
      margin-top: 5px;
      text-align: right;
    }

    .chat-input {
      padding: 15px;
      border-top: 1px solid #eee;
      background: white;
      display: flex;
      gap: 10px;
      border-radius: 0 0 15px 15px;
    }

    .chat-input input {
      flex: 1;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 25px;
      outline: none;
      font-size: 0.95rem;
      transition: border-color 0.3s ease;
    }

    .chat-input input:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.1);
    }

    .chat-input button {
      padding: 12px 20px;
      background: #0d6efd;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .chat-input button:hover:not(:disabled) {
      background: #0b5ed7;
      transform: translateY(-1px);
    }

    .chat-input button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .error {
      color: red;
      font-size: 0.8em;
      padding: 5px 15px;
    }

    /* Scrollbar styling */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class ChatWindowComponent implements OnDestroy, AfterViewChecked {
  @Input() doctorId: number | null = null;
  @Input() doctorName: string = '';
  @Input() userId: number | null = null;  // Add @Input for userId
  @Input() userName: string = ''; 
  @Output() closeChat = new EventEmitter<void>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @Input() isDoctor: boolean = false;
@Input() patientId: number | null = null;
@Input() patientName: string = '';
recipientName: string = '';
  isOpen: boolean = true;
  messages: any[] = [];
  newMessage: string = '';
  isSending: boolean = false;
  errorMessage: string = '';
  baseUrl = environment.apiUrl;
  private refreshInterval: any;
  private shouldScroll: boolean = true;
  conversationId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.recipientName = this.isDoctor ? this.patientName : this.doctorName;
    if (this.isDoctor ? this.patientId : this.doctorId) {
      this.startConversation();
    }
  }

  private startConversation() {
    const payload = this.isDoctor 
      ? { patient_id: this.patientId }
      : { doctor_id: this.doctorId };
  
    this.http.post(`${this.baseUrl}/chat/start`, payload)
      .subscribe({
        next: (response: any) => {
          const conversationId = response?.data?.id;
          if (conversationId) {
            this.conversationId = conversationId;
            this.loadMessages();
          } else {
            this.errorMessage = 'Failed to start conversation. Please try again.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Error starting conversation: ' + error.message;
        }
      });
  }
  

  private startMessageRefresh() {
    this.refreshInterval = setInterval(() => {
      if (this.isOpen && this.conversationId) {
        this.loadMessages();
      }
    }, 5000); // Refresh every 5 seconds
  }

  private stopMessageRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadMessages() {
    if (this.conversationId) {
      this.http.get(`${this.baseUrl}/chat/messages/${this.conversationId}`)
        .subscribe({
          next: (response: any) => {
            if (response.data) {
              this.messages = response.data;
              this.shouldScroll = true;
            }
          },
          error: (error) => {
            console.error('Error loading messages:', error);
            this.errorMessage = 'Error loading messages: ' + error.message;
          }
        });
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.conversationId) {
      this.isSending = true;
      this.errorMessage = '';
      const tempMessage = {
        message: this.newMessage,
        sender_type: this.isDoctor ? 'doctor' : 'user',
        created_at: new Date(),
      };
      this.messages.push(tempMessage);
      this.shouldScroll = true;
  
      this.http.post(`${this.baseUrl}/chat/send`, {
        conversation_id: this.conversationId,
        message: this.newMessage,
        is_doctor: this.isDoctor
      }).subscribe({
        next: () => {
          this.newMessage = '';
          this.isSending = false;
        },
        error: (error) => {
          this.errorMessage = 'Error sending message: ' + (error.message || 'Unknown error');
          this.messages = this.messages.filter(msg => msg !== tempMessage);
          this.shouldScroll = true;
          this.isSending = false;
        }
      });
    }
  }

  handleClose() {
    this.isOpen = false;
    this.stopMessageRefresh();
    this.closeChat.emit();
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy() {
    this.stopMessageRefresh();
  }
}