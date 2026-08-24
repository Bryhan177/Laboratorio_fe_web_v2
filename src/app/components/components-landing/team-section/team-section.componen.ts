import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
    selector: 'app-team-section',
    standalone: true,
    imports: [AvatarModule, AnimateOnScrollModule],
    templateUrl: './team-section.component.html'
})
export class TeamSectionComponent implements AfterViewInit, OnDestroy {
    @ViewChild('mainVideo') mainVideo!: ElementRef<HTMLVideoElement>;
    @ViewChild('videoHost') videoHost!: ElementRef<HTMLElement>;

    readonly previewSrc = 'assets/video/VideoPresent.mp4';
    readonly modalSrc = 'assets/video/Team.mp4';

    isVideoModalOpen = false;
    videoSrc: string | null = null;

    private observer: IntersectionObserver | null = null;

    ngAfterViewInit(): void {
        const host = this.videoHost?.nativeElement;
        if (!host || typeof IntersectionObserver === 'undefined') {
            this.activatePreviewVideo();
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) {
                    this.pausePreview();
                    return;
                }
                this.activatePreviewVideo();
            },
            { rootMargin: '120px 0px', threshold: 0.15 }
        );

        this.observer.observe(host);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    openVideoModal(): void {
        this.isVideoModalOpen = true;
    }

    closeVideoModal(): void {
        this.isVideoModalOpen = false;
    }

    activatePreviewVideo(): void {
        if (!this.videoSrc) {
            this.videoSrc = this.previewSrc;
        }

        queueMicrotask(() => {
            const el = this.mainVideo?.nativeElement;
            if (!el) {
                return;
            }
            el.play().catch(() => {
                /* autoplay puede bloquearse; el usuario puede abrir el modal */
            });
        });
    }

    private pausePreview(): void {
        const el = this.mainVideo?.nativeElement;
        if (el && !el.paused) {
            el.pause();
        }
    }
}
