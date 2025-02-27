import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

interface Message {
  id: number;
  text: string;
  sentByUser: boolean;
  timestamp: Date;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  status: string;
  lastMessage: string;
  messages: Message[];
}

@Component({
  selector: 'app-chats',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export default class ChatsComponent {
  // Control de visibilidad del sidebar en pantallas pequeñas
  isSidebarOpen = false;

  // Usuario actual
  currentUser = {
    name: 'Alan Smith',
    role: 'Software Developer',
    avatar: 'https://i.pravatar.cc/150?img=10'
  };

  // Control para búsqueda
  searchControl = new FormControl('');

  // Control para escribir mensajes
  messageControl = new FormControl('');

  // Pestaña activa
  activeTab = 'chats';

  // Lista de chats
  chats: Chat[] = [
    {
      id: 1,
      name: 'Nia Hillyer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'Active now',
      lastMessage: 'I am well',
      messages: [
        {
          id: 1,
          text: 'Hi, I am back from vacation',
          sentByUser: false,
          timestamp: new Date('2025-02-23T14:09:00')
        },
        {
          id: 2,
          text: 'How are you?',
          sentByUser: false,
          timestamp: new Date('2025-02-23T14:10:00')
        },
        {
          id: 3,
          text: 'Welcome Back',
          sentByUser: true,
          timestamp: new Date('2025-02-23T14:11:00')
        },
        {
          id: 4,
          text: 'I am well',
          sentByUser: true,
          timestamp: new Date('2025-02-23T14:12:00')
        }
      ]
    },
    {
      id: 2,
      name: 'Sean Freeman',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: 'Offline',
      lastMessage: 'I was wondering...',
      messages: [
        {
          id: 1,
          text: 'I was wondering if you got my email?',
          sentByUser: false,
          timestamp: new Date('2025-02-22T16:30:00')
        }
      ]
    },
    {
      id: 3,
      name: 'Alma Clarke',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: 'Active now',
      lastMessage: 'Sure, let me check!',
      messages: [
        {
          id: 1,
          text: 'Hello, can you help me with something?',
          sentByUser: false,
          timestamp: new Date('2025-02-22T10:15:00')
        },
        {
          id: 2,
          text: 'Sure, let me check!',
          sentByUser: true,
          timestamp: new Date('2025-02-22T10:20:00')
        }
      ]
    }
  ];

  // Chat seleccionado
  selectedChat: Chat | null = null;

  // Alternar sidebar en pantallas pequeñas
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Lista filtrada de chats
  get filteredChats(): Chat[] {
    const term = this.searchControl.value?.toLowerCase() || '';
    return this.chats.filter(chat =>
      chat.name.toLowerCase().includes(term)
    );
  }

  // Cambiar pestaña
  setTab(tab: string) {
    this.activeTab = tab;
  }

  // Seleccionar chat
  selectChat(chat: Chat) {
    this.selectedChat = chat;
    // En pantallas pequeñas, cierra el sidebar al seleccionar
    this.isSidebarOpen = false;
  }

  // Enviar mensaje
  sendMessage() {
    if (!this.selectedChat) return;

    const text = this.messageControl.value?.trim();
    if (text) {
      this.selectedChat.messages.push({
        id: Date.now(),
        text,
        sentByUser: true,
        timestamp: new Date()
      });
      this.selectedChat.lastMessage = text;
      this.messageControl.reset();
    }
  }

  // Formato de hora
  formatDate(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Agrupar mensajes por fecha
  getGroupedMessages() {
    if (!this.selectedChat) return [];
    const messages = this.selectedChat.messages;

    const grouped: { date: string; messages: Message[] }[] = [];

    for (const msg of messages) {
      const day = msg.timestamp.toDateString();
      let group = grouped.find(g => g.date === day);
      if (!group) {
        group = { date: day, messages: [] };
        grouped.push(group);
      }
      group.messages.push(msg);
    }
    return grouped;
  }
}
