import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsService } from '../../../app/pages/questions/questions.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-list-resp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-resp.component.html',
  styleUrl: './list-resp.component.scss'
})
export class ListRespComponent implements OnInit {
    users: any[] = []; // 🔹 Asegurar que sea un array

    constructor(private questionsService: QuestionsService) {}

    ngOnInit() {
      this.loadUsers();
    }

    async loadUsers() {
      this.users = await this.questionsService.getUsers();
    }
  }
