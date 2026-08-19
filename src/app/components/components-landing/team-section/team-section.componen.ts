import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
}

@Component({
    selector: 'app-team-section',
    standalone: true,
    imports: [AvatarModule, AnimateOnScrollModule],
    templateUrl: './team-section.component.html'
})
export class TeamSectionComponent implements OnInit, OnDestroy {
  @ViewChild('mainVideo') mainVideo!: ElementRef<HTMLVideoElement>;
  
  mediaItems: MediaItem[] = [
    { type: 'video', src: 'assets/video/Team.mp4' }
  ];
  
  currentIndex = 0;
  private intervalId: any;
  isVideoModalOpen = false;

  get currentMedia(): MediaItem {
    return this.mediaItems[this.currentIndex];
  }

  ngOnInit() {
    // Intentar reproducir el video automáticamente
    setTimeout(() => {
      if (this.mainVideo?.nativeElement) {
        this.mainVideo.nativeElement.play().catch(err => {
          console.log('Autoplay bloqueado por el navegador:', err);
        });
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.stopRotation();
  }

  private stopRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  openVideoModal() {
    this.isVideoModalOpen = true;
  }

  closeVideoModal() {
    this.isVideoModalOpen = false;
  }
}