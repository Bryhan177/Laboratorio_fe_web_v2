import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesAlertModalComponent } from './courses-alert-modal.component';

describe('CoursesAlertModalComponent', () => {
  let component: CoursesAlertModalComponent;
  let fixture: ComponentFixture<CoursesAlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesAlertModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
