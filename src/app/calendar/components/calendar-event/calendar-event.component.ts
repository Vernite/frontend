import { Component, Input } from '@angular/core';
import { EventType } from '@calendar/enums/event-type.enum';
import { Event } from '@calendar/interfaces/event.interface';
import {
  faArrowUpRightFromSquare,
  faClose,
  faEllipsisVertical,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MeetingService } from '@calendar/services/meeting.service';
import { switchMap, tap } from 'rxjs';
import { TaskService } from './../../../tasks/services/task/task.service';

/**
 * Calendar event component to display event
 */
@Component({
  selector: 'calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
})
export class CalendarEventComponent {
  /** Event to display */
  @Input() event!: Event;

  /** Is event overlay open */
  public isOpen = false;

  /** @ignore */
  faClose = faClose;

  /** @ignore */
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;

  /** @ignore */
  faEllipsisVertical = faEllipsisVertical;

  /** @ignore */
  faPen = faPen;

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private taskService: TaskService,
  ) {}

  /**
   * Open event details
   */
  openDetails() {
    switch (this.event.type) {
      case EventType.MEETING:
        this.router.navigate(['/', 'meetings', this.event.relatedId]);
        break;
      case EventType.TASK_DEADLINE:
      case EventType.TASK_ESTIMATE:
        this.router.navigate([
          '/',
          'projects',
          this.event.projectId,
          'tasks',
          this.event.relatedId,
        ]);
        break;
      case EventType.SPRINT:
        this.router.navigate(['/', 'sprints', this.event.relatedId]);
        break;
    }
  }

  /**
   * Open edit event dialog
   */
  openEdit() {
    switch (this.event.type) {
      case EventType.MEETING:
        this.meetingService
          .get(this.event.projectId, this.event.relatedId)
          .pipe(
            tap(() => this.closeOverlay()),
            switchMap((meeting) => {
              return this.meetingService.openEditMeetingDialog(this.event.projectId, meeting);
            }),
          )
          .subscribe((meeting) => {
            if (meeting) {
              location.reload();
            }
          });
        break;
      case EventType.TASK_DEADLINE:
      case EventType.TASK_ESTIMATE:
        this.taskService
          .get(this.event.projectId, this.event.relatedId)
          .pipe(
            tap(() => this.closeOverlay()),
            switchMap((task) => {
              return this.taskService.openEditTaskDialog(this.event.projectId, task);
            }),
          )
          .subscribe((task) => {
            if (task) {
              location.reload();
            }
          });
    }
  }

  /**
   * Open event overlay
   */
  openOverlay() {
    this.isOpen = true;
  }

  /**
   * Close event overlay
   */
  closeOverlay() {
    this.isOpen = false;
  }
}
