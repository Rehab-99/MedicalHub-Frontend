import { Component, Input } from '@angular/core';
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
        <h3>Chat with {{ doctorName }}</h3>
        <button class="close-button" (click)="closeChat()">×</button>
      </div>
      <div class="chat-messages">
        <div *ngFor="let message of messages" class="message" [ngClass]="{'sent': message.sender_type === 'user', 'received': message.sender_type === 'doctor'}">
          <div class="message-content">{{ message.message }}</div>
          <div class="message-time">{{ message.created_at | date:'shortTime' }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" [(ngModel)]="newMessage" placeholder="Type your message..." (keyup.enter)="sendMessage()">
        <button (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 15px;
      background: #4CAF50;
      color: white;
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }

    .chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
    }

    .message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 80%;
      display: flex;
      flex-direction: column;
    }

    .message.sent {
      background: #4CAF50;
      color: white;
      margin-left: auto;
    }

    .message.received {
      background: #f1f1f1;
      margin-right: auto;
    }

    .message-content {
      word-break: break-word;
    }

    .message-time {
      font-size: 0.7em;
      opacity: 0.7;
      margin-top: 4px;
      text-align: right;
    }

    .chat-input {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }

    .chat-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .chat-input button {
      padding: 8px 15px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ChatWindowComponent {
  @Input() doctorId: number | null = null;
  @Input() doctorName: string = '';
  isOpen: boolean = true;
  messages: any[] = [];
  newMessage: string = '';
  baseUrl = environment.apiUrl;
  conversationId: string = '1';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.doctorId) {
      this.loadMessages();
    }
  }

  loadMessages() {
    this.http.get(`${this.baseUrl}/chat/messages/${this.doctorId}`).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.messages = response.data.map((msg: any) => ({
            id: msg.id,
            message: msg.message,
            sender_type: msg.sender_type,
            created_at: new Date(msg.created_at),
            sender: msg.sender
          }));
        }
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  closeChat() {
    this.isOpen = false;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.doctorId) {
      // Add the message to the UI immediately
      this.messages.push({
        message: this.newMessage,
        sender_type: 'user',
        created_at: new Date(),
        sender: {
          name: 'You'
        }
      });
      
      // Send the message to the server
      this.http.post(`${this.baseUrl}/chat/send`, {
        conversation_id: this.conversationId,
        message: this.newMessage
      }).subscribe({
        next: (response: any) => {
          console.log('Message sent successfully:', response);
          if (response.success) {
            console.log('Message confirmed by server');
          }
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });

      // Clear the input field
      this.newMessage = '';
    }
  }
} 