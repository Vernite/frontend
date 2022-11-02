import { Injectable, Injector } from '@angular/core';
import { ProjectMember } from '@dashboard/interfaces/project-member.interface';
import { Project } from '@dashboard/interfaces/project.interface';
import { MemberService } from '@dashboard/services/member/member.service';
import { Enum } from '@main/classes/enum.class';
import { Cache } from '@main/decorators/cache/cache.decorator';
import { Service } from '@main/decorators/service/service.decorator';
import { AlertDialogVariant } from '@main/dialogs/alert/alert.dialog';
import { DataFilter } from '@main/interfaces/filters.interface';
import { Errors } from '@main/interfaces/http-error.interface';
import { ApiService } from '@main/services/api/api.service';
import { BaseService } from '@main/services/base/base.service';
import { DialogOutlet, DialogService } from '@main/services/dialog/dialog.service';
import { SnackbarService } from '@main/services/snackbar/snackbar.service';
import { TaskDialog, TaskDialogData, TaskDialogVariant } from '@tasks/dialogs/task/task.dialog';
import { TaskType, TaskTypeHierarchy } from '@tasks/enums/task-type.enum';
import { Schedule } from '@tasks/interfaces/schedule.interface';
import { Task } from '@tasks/interfaces/task.interface';
import * as dayjs from 'dayjs';
import { isNumber } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Service()
@Injectable({
  providedIn: 'root',
})
export class TaskService extends BaseService<
  Errors<'FORM_VALIDATION_ERROR' | 'PROJECT_NOT_FOUND'>
> {
  private lists = new Map<Project['id'], ReplaySubject<Task[]>>();

  protected override errorCodes = {
    FORM_VALIDATION_ERROR: {
      message: $localize`Form validation error`,
    },
    PROJECT_NOT_FOUND: {
      message: $localize`Project not found`,
    },
  };

  constructor(
    private injector: Injector,
    private apiService: ApiService,
    private dialogService: DialogService,
    private memberService: MemberService,
    private snackbarService: SnackbarService,
  ) {
    super(injector);
  }

  /**
   * Get list of tasks
   * @param projectId Project id needed to list all tasks
   * @returns Request observable with list of tasks
   */
  @Cache()
  public list(
    projectId: number,
    filters?: DataFilter<Task, any>[] | DataFilter<Task, any>,
  ): Observable<Task[]> {
    return this.apiService.get<Task[]>(`/project/${projectId}/task`, { filters }).pipe(
      this.validate({
        404: 'PROJECT_NOT_FOUND',
      }),
    );
  }

  /**
   * Creates new task
   * @param task Task to create
   * @param projectId Project id needed to create task
   * @returns Request observable with the created task
   */
  public create(projectId: number, task: Task): Observable<Task> {
    return this.apiService.post(`/project/${projectId}/task/`, { body: task }).pipe(
      this.validate({
        400: 'FORM_VALIDATION_ERROR',
        404: 'PROJECT_NOT_FOUND',
      }),
      tap(() => {
        this.snackbarService.show($localize`Task created successfully!`);
      }),
    );
  }

  /**
   * Updates task
   * @param task Task to update
   * @param projectId Project id needed to update task
   * @returns Request observable with the updated task
   */
  public update(projectId: number, task: Partial<Task> & { id: number }): Observable<Task> {
    return this.apiService.put(`/project/${projectId}/task/${task.id}`, { body: task }).pipe(
      this.validate({
        400: 'FORM_VALIDATION_ERROR',
        404: 'PROJECT_NOT_FOUND',
      }),
      tap(() => {
        this.snackbarService.show($localize`Task updated successfully!`);
      }),
    );
  }

  /**
   * Deletes task
   * @param taskId Task id to delete
   * @param projectId Project id needed to delete task
   * @returns Request observable
   */
  public delete(projectId: number, taskId: number): Observable<null> {
    return this.apiService.delete(`/project/${projectId}/task/${taskId}`).pipe(
      this.validate({
        404: 'PROJECT_NOT_FOUND',
      }),
    );
  }

  /**
   * Opens dialog to delete specific task
   * @param projectId Project id needed to delete task
   * @param task Task to delete
   * @returns Observable with true if task was deleted, EMPTY otherwise (when user cancels the dialog)
   */
  public deleteWithConfirmation(projectId: number, task: Task): Observable<boolean | null> {
    return this.dialogService
      .confirm({
        title: $localize`Delete task "${task.name}"`,
        message: $localize`Are you sure you want to delete this task "${task.name}"?`,
        confirmText: $localize`Delete`,
        cancelText: $localize`Cancel`,
        variant: AlertDialogVariant.IMPORTANT,
      })
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            return this.delete(projectId, task.id).pipe(switchMap(() => of(true)));
          } else {
            return EMPTY;
          }
        }),
      );
  }

  /**
   * Opens dialog to edit specific task
   * @param projectId Project id needed to update task
   * @param task Task to update
   * @returns Observable with updated task, EMPTY otherwise (when user cancels the dialog)
   */
  public openEditTaskDialog(projectId: number, task: Task): Observable<Task | null> {
    return this.dialogService
      .open(
        TaskDialog,
        {
          variant: TaskDialogVariant.EDIT,
          projectId,
          task,
        } as TaskDialogData,
        DialogOutlet.CONTENT_RIGHT,
      )
      .afterClosed()
      .pipe(
        switchMap((updatedTask: any) => {
          if (updatedTask) {
            return this.update(projectId, updatedTask);
          } else {
            return EMPTY;
          }
        }),
      );
  }

  /**
   * Opens dialog to create new task
   * @returns created task, EMPTY otherwise (when user cancels the dialog)
   */
  public openCreateNewTaskDialog() {
    return this.dialogService
      .open(
        TaskDialog,
        {
          variant: TaskDialogVariant.CREATE,
        } as TaskDialogData,
        DialogOutlet.CONTENT_RIGHT,
      )
      .afterClosed()
      .pipe(
        switchMap((task: Task) => {
          if (task) {
            return this.create(task.projectId, task);
          } else {
            return EMPTY;
          }
        }),
      );
  }

  /**
   * Opens dialog to create new subtask
   * @param projectId Project id needed to update subtask
   * @param parentTask Parent task id to which attach subtask
   * @returns created subtask, EMPTY otherwise (when user cancels the dialog)
   */
  public openCreateSubtaskDialog(projectId: number, parentTask: Task): Observable<Task | null> {
    return this.dialogService
      .open(
        TaskDialog,
        {
          variant: TaskDialogVariant.CREATE,
          projectId: projectId,
          parentTask: parentTask,
          task: {
            parentTaskId: parentTask.id,
          },
        } as TaskDialogData,
        DialogOutlet.CONTENT_RIGHT,
      )
      .afterClosed()
      .pipe(
        switchMap((newTask: any) => {
          if (newTask) {
            return this.create(projectId, newTask);
          } else {
            return EMPTY;
          }
        }),
      );
  }

  /**
   * Generates schedule object for specific project
   * @param projectId Project id to generate schedule from
   * @returns Schedule object with all tasks
   */
  public schedule(projectId: number): Observable<Schedule> {
    return combineLatest([
      this.list(projectId).pipe(take(1)),
      this.memberService.list(projectId).pipe(take(1)),
    ]).pipe(
      map(([tasks, members]: [tasks: Task[], members: ProjectMember[]]) => {
        const schedules = [];

        for (const { user } of members) {
          schedules.push({ user, tasks: new Map() });
        }

        for (const task of tasks) {
          const schedule = schedules.find((s) => s.user.id === task.assigneeId);

          if (!schedule) continue;

          if (task.estimatedDate) {
            schedule.tasks.set(dayjs(task.estimatedDate).format('YYYY-MM-DD'), task);
          } else {
            if (!schedule.tasks.has(null)) schedule.tasks.set(null, []);

            schedule.tasks.get(null).push(task);
          }
        }

        return schedules;
      }),
    );
  }

  /**
   * Assign task to specific user
   * @param userId user to assign task to (if null, task will be unassigned)
   * @param taskId task to assign
   * @param projectId project id needed to assign task
   * @returns Updated task object
   */
  public assign(assigneeId: number | null, taskId: number, projectId: number): Observable<Task> {
    return this.update(projectId, { id: taskId, assigneeId });
  }

  /**
   * Change status of specific task
   * @param statusId status to change task to
   * @param taskId task to change status of
   * @param projectId project id needed to change status
   * @returns Updated task object
   */
  public changeStatus(statusId: number, taskId: number, projectId: number): Observable<Task> {
    return this.update(projectId, { id: taskId, statusId });
  }

  /**
   * List all task types for specific parent task
   * @param parentTaskType parent task type to list task types for
   * @returns observable with list of task types
   */
  public listTaskTypes(parentTaskType?: TaskType) {
    const parentTaskTypeNormal = isNumber(parentTaskType) ? parentTaskType : -1;
    const desiredTaskTypes = TaskTypeHierarchy[parentTaskTypeNormal];
    const taskTypesEntries = Enum.entries(TaskType);

    return new BehaviorSubject(
      desiredTaskTypes.map(
        (taskType) => taskTypesEntries.find(([_, value]) => value === taskType)!,
      ),
    );
  }

  /**
   * List all epics for specific project
   * @param projectId project identifier to list epics from
   * @returns observable with list of epics
   */
  public listEpics(projectId: number) {
    return this.list(projectId).pipe(
      map((tasks) => tasks.filter((task) => task.type === TaskType.EPIC)),
    );
  }
}