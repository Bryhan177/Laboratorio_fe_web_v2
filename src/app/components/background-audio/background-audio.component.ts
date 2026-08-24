import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    computed,
    signal
} from '@angular/core';

@Component({
    selector: 'app-background-audio',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './background-audio.component.html',
    styleUrls: ['./background-audio.component.scss']
})
export class BackgroundAudioComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() src: string = 'assets/video/background.mp3';
    @Input() defaultVolume: number = 0.35; // 35% de volumen para sonido ambiente
    @Input() autoPlayOnInteraction: boolean = true;

    @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;

    readonly isPlaying = signal<boolean>(false);
    readonly isMuted = signal<boolean>(false);
    readonly volume = signal<number>(0.35);
    readonly showControls = signal<boolean>(false);
    readonly hasError = signal<boolean>(false);
    readonly isAudioReady = signal<boolean>(false);

    readonly isLowVolume = computed<boolean>(() => this.volume() < 0.5);

    private interactionListenersAttached = false;
    // Solo gestos de usuario válidos para desbloquear audio en navegadores modernos:
    private readonly interactionEvents = ['pointerdown', 'keydown', 'touchstart', 'click'] as const;

    private readonly handleUserGesture = () => {
        if (!this.isPlaying() && this.autoPlayOnInteraction) {
            this.playAudio();
        }
    };

    ngOnInit(): void {
        this.volume.set(this.defaultVolume);
    }

    ngAfterViewInit(): void {
        if (this.audioRef?.nativeElement) {
            const audio = this.audioRef.nativeElement;
            audio.volume = this.volume();
            audio.load();
        }

        if (this.autoPlayOnInteraction) {
            // Intentar reproducir directamente (por si el navegador lo permite)
            this.playAudio();
            // Y asociar listeners para el primer clic/tecla
            this.attachInteractionListeners();
        }
    }

    ngOnDestroy(): void {
        this.removeInteractionListeners();
        if (this.audioRef?.nativeElement) {
            this.audioRef.nativeElement.pause();
        }
    }

    private attachInteractionListeners(): void {
        if (typeof window === 'undefined' || this.interactionListenersAttached) return;
        this.interactionListenersAttached = true;
        for (const event of this.interactionEvents) {
            window.addEventListener(event, this.handleUserGesture, { passive: true });
        }
    }

    private removeInteractionListeners(): void {
        if (typeof window === 'undefined' || !this.interactionListenersAttached) return;
        for (const event of this.interactionEvents) {
            window.removeEventListener(event, this.handleUserGesture);
        }
        this.interactionListenersAttached = false;
    }

    onAudioLoaded(): void {
        this.isAudioReady.set(true);
        this.hasError.set(false);
        if (this.audioRef?.nativeElement) {
            this.audioRef.nativeElement.volume = this.volume();
        }
    }

    onAudioCanPlay(): void {
        this.isAudioReady.set(true);
        this.hasError.set(false);
    }

    onAudioError(event: Event): void {
        console.warn('Audio de fondo no encontrado o no compatible en:', this.src, event);
        this.hasError.set(true);
        this.isPlaying.set(false);
    }

    togglePlay(): void {
        if (this.isPlaying()) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
    }

    playAudio(): void {
        if (!this.audioRef?.nativeElement) return;
        const audio = this.audioRef.nativeElement;
        audio.volume = this.volume();

        audio
            .play()
            .then(() => {
                this.isPlaying.set(true);
                this.hasError.set(false);
                // Una vez reproduciendo con éxito, retiramos los listeners globales
                this.removeInteractionListeners();
            })
            .catch((err) => {
                // NotAllowedError esperado antes del primer clic del usuario
                console.info('Audio esperando interacción de usuario para reproducir:', err.message);
                this.isPlaying.set(false);
            });
    }

    pauseAudio(): void {
        if (!this.audioRef?.nativeElement) return;
        this.audioRef.nativeElement.pause();
        this.isPlaying.set(false);
    }

    toggleMute(): void {
        if (!this.audioRef?.nativeElement) return;
        const audio = this.audioRef.nativeElement;
        const newMute = !this.isMuted();
        audio.muted = newMute;
        this.isMuted.set(newMute);
    }

    onVolumeChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const val = parseFloat(input.value);
        this.volume.set(val);
        if (this.audioRef?.nativeElement) {
            this.audioRef.nativeElement.volume = val;
            if (val === 0) {
                this.isMuted.set(true);
            } else if (this.isMuted()) {
                this.isMuted.set(false);
                this.audioRef.nativeElement.muted = false;
            }
        }
    }
}
