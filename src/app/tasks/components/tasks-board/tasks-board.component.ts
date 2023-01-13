import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectMember } from '@dashboard/interfaces/project-member.interface';
import {
  faCheck,
  faChevronRight,
  faCodeCommit,
  faCodePullRequest,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { PersistentMap } from '@main/classes/persistent-map/persistent-map.class';
import { TaskService } from '@tasks/services/task/task.service';
import { DialogService } from '../../../_main/services/dialog/dialog.service';
import { TaskDialog, TaskDialogData, TaskDialogVariant } from '../../dialogs/task/task.dialog';
import { StatusWithTasks } from '../../interfaces/status.interface';
import { Task } from '../../interfaces/task.interface';

/**
 * Board component to display tasks in columns
 */
@Component({
  selector: 'tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss'],
})
export class BoardComponent {
  /** Board interface to display */
  @Input() board: [string | Task, StatusWithTasks[]][] = [];

  /** List of members */
  @Input() members!: Map<number, ProjectMember>;

  /** Id of the project */
  @Input() projectId!: number;

  /** List of statuses */
  @Input() statusList: StatusWithTasks[] = [];

  /** @ignore */
  faPlus = faPlus;

  /** @ignore */
  faChevronRight = faChevronRight;

  /** @ignore */
  faCodeCommit = faCodeCommit;

  /** @ignore */
  faCodePullRequest = faCodePullRequest;

  /** @ignore */
  faCheck = faCheck;

  /** Map used to determine if user expanded certain task and remember it */
  public taskMap = new PersistentMap<number | string, boolean>({ persistentKey: 'board' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private dialogService: DialogService,
  ) {
    const { projectId } = this.activatedRoute.snapshot.params;

    this.projectId = projectId;
  }

  /** Get list of tasks from status */
  getTasksFromStatus(statusId: number) {
    return this.statusList.find((status) => status.id === statusId)?.tasks;
  }

  /** On task drop method */
  drop(event: CdkDragDrop<Task[]>) {
    const previousStatusIndex = Number(
      event.previousContainer.element.nativeElement.dataset['index'],
    );
    const newStatusIndex = Number(event.container.element.nativeElement.dataset['index']);
    const _previousStatus = this.statusList[previousStatusIndex];
    const newStatus = this.statusList[newStatusIndex];
    const previousTaskIndex = event.previousIndex;
    const task = event.previousContainer.data[previousTaskIndex];

    const onSuccess = () => {
      task.statusId = newStatus.id!;
      this.taskService.update(this.projectId, task as any).subscribe();

      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    };

    // Catch if the task has pull request and user is trying to move to finishing state
    if (task.pull && newStatus.final) {
      this.dialogService
        .alert({
          title: $localize`Are you sure?`,
          message: $localize`If you will move this task to finishing state, the attached pull request will be merged to the repository.`,
          confirmText: $localize`Merge`,
          cancelText: $localize`Cancel`,
        })
        .subscribe((result) => {
          if (!result) return;

          onSuccess();
        });
    } else {
      onSuccess();
    }
  }

  /** Open create task dialog */
  openNewTaskDialog() {
    this.dialogService
      .open(TaskDialog, {
        projectId: this.projectId,
        variant: TaskDialogVariant.CREATE,
      } as TaskDialogData)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.taskService.create(this.projectId, result).subscribe(() => {
            location.reload();
          });
        }
      });
  }

  /** Get id of task (from task format or string format) */
  idOf(o: Task | string) {
    return (o as any).id || o;
  }

  /** Calculates column container height based of expanded state and size of the content */
  getColumnsContainerHeight(mapKey: string | number, element: HTMLElement) {
    return `${Number(!this.taskMap.get(mapKey)) * element.scrollHeight + 16}px`;
  }

  /** Toggle expanded state of the column */
  toggle(board: [Task | string, StatusWithTasks[]], element: HTMLElement) {
    element.style.maxHeight = this.getColumnsContainerHeight(this.idOf(board[0]), element);
    this.taskMap.set(this.idOf(board[0]), !this.taskMap.get(this.idOf(board[0])) || false);
    element.style.maxHeight = this.getColumnsContainerHeight(this.idOf(board[0]), element);
  }
}
