import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { AppEvent, EventsService } from '../../../service/events.service';

interface CalendarCell {
    day: number;
    inMonth: boolean;
    events: AppEvent[];
}

@Component({
    selector: 'app-calendar-section',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html'
})
export class CalendarSectionComponent implements OnInit {
    readonly loading = signal(true);
    readonly errorMessage = signal('');
    readonly events = signal<AppEvent[]>([]);
    readonly visibleMonth = signal(this.startOfMonth(new Date()));

    readonly monthLabel = computed(() =>
        this.visibleMonth().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
    );

    readonly yearLabel = computed(() => this.visibleMonth().getFullYear());

    readonly cells = computed(() => {
        const monthDate = this.visibleMonth();
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const eventsByDay = this.eventsByDay(year, month);

        const result: CalendarCell[] = [];
        for (let i = 0; i < firstDay; i++) {
            result.push({ day: 0, inMonth: false, events: [] });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            result.push({ day, inMonth: true, events: eventsByDay.get(day) ?? [] });
        }
        return result;
    });

    readonly upcomingEvents = computed(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.events()
            .filter((event) => {
                const date = this.parseDate(event.event_date);
                return date && date >= today && event.status === 'proximo';
            })
            .slice(0, 4);
    });

    readonly nextEvent = computed((): AppEvent | null => this.upcomingEvents()[0] ?? null);
    readonly selectedEvent = signal<AppEvent | null>(null);
    readonly featuredEvent = computed((): AppEvent | null => this.selectedEvent() ?? this.nextEvent());
    readonly featuredImage = computed(() => this.featuredEvent()?.image_url || 'assets/img/events.png');

    constructor(private eventsService: EventsService) {}

    async ngOnInit(): Promise<void> {
        this.loading.set(true);
        this.errorMessage.set('');

        try {
            const events = await this.eventsService.listPublic();
            this.events.set(events);
            const next = events.find((event) => {
                const date = this.parseDate(event.event_date);
                return date && date >= this.startOfMonth(new Date());
            });
            if (next) {
                const date = this.parseDate(next.event_date);
                if (date) {
                    this.visibleMonth.set(this.startOfMonth(date));
                }
            }
        } catch (error) {
            this.errorMessage.set(error instanceof Error ? error.message : 'No se pudieron cargar los eventos.');
        } finally {
            this.loading.set(false);
        }
    }

    previousMonth(): void {
        const current = this.visibleMonth();
        this.visibleMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    }

    nextMonth(): void {
        const current = this.visibleMonth();
        this.visibleMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    }

    formatDate(value: string): string {
        const date = this.parseDate(value);
        if (!date) {
            return value;
        }
        return date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long' });
    }

    showEvent(event: AppEvent): void {
        this.selectedEvent.set(event);
    }

    private eventsByDay(year: number, month: number): Map<number, AppEvent[]> {
        const map = new Map<number, AppEvent[]>();
        for (const event of this.events()) {
            const date = this.parseDate(event.event_date);
            if (!date || date.getFullYear() !== year || date.getMonth() !== month) {
                continue;
            }
            const day = date.getDate();
            const current = map.get(day) ?? [];
            current.push(event);
            map.set(day, current);
        }
        return map;
    }

    private parseDate(value: string): Date | null {
        const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private startOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
}
