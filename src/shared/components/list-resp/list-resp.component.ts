import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { QuestionsService } from '../../../app/pages/questions/questions.service'; // Ajusta la ruta según tu estructura
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-list-resp',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        InputTextModule,
        ToolbarModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './list-resp.component.html',
    styleUrls: ['./list-resp.component.scss']
})
export class ListRespComponent implements OnInit {
    users: any[] = [];
    @ViewChild('dt', { static: true }) dt!: Table;


    constructor(private questionsService: QuestionsService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    async loadUsers() {
        this.users = await this.questionsService.getUsers();
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}
