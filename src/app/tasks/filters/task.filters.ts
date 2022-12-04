import { ProjectMember } from '@dashboard/interfaces/project-member.interface';
import { DataFilter, DataFilterType, DataFilterWithView } from '@main/interfaces/filters.interface';
import { TaskType } from '@tasks/enums/task-type.enum';
import { Task } from '@tasks/interfaces/task.interface';
import { Observable } from 'rxjs';
import { InputAssigneeComponent } from '../components/input-assignee/input-assignee.component';

export class TaskFilters {
  public static SPRINT_ID(sprintId: number): DataFilter<Task, number> {
    return {
      identifier: 'SPRINT_ID',
      type: DataFilterType.BACKEND,
      field: 'sprintId',
      value: sprintId,
      apply(list) {
        return list.filter((task) => task.sprintId === sprintId);
      },
    };
  }

  public static ASSIGNEE_ID(assigneeId: number): DataFilterWithView<Task, number> {
    return {
      identifier: 'ASSIGNEE_ID',
      type: DataFilterType.BACKEND,
      field: 'assigneeId',
      value: assigneeId,
      apply(list) {
        return list.filter((task) => task.assigneeId === assigneeId);
      },
      view(members: Observable<ProjectMember[]>) {
        return {
          component: InputAssigneeComponent,
          props: {
            members,
          },
        };
      },
    };
  }

  public static STATUS_IDS(statusIds: number[]): DataFilter<Task, number[]> {
    return {
      identifier: 'STATUS_IDS',
      type: DataFilterType.BACKEND,
      field: 'statusId',
      value: statusIds,
      apply(list) {
        return list.filter((task) => statusIds.includes(task.statusId));
      },
    };
  }

  public static TYPES(types: TaskType[]): DataFilter<Task, TaskType[]> {
    return {
      identifier: 'TYPES',
      type: DataFilterType.BACKEND,
      field: 'type',
      value: types,
      apply(list) {
        return list.filter((task) => types.includes(task.type));
      },
    };
  }

  public static PARENT_TASK_ID(parentTaskId: number): DataFilter<Task, number> {
    return {
      identifier: 'PARENT_TASK_ID',
      type: DataFilterType.BACKEND,
      field: 'parentTaskId',
      value: parentTaskId,
      apply(list) {
        return list.filter((task) => task.parentTaskId === parentTaskId);
      },
    };
  }

  public static BACKLOG(): DataFilter<Task, boolean> {
    return {
      identifier: 'BACKLOG',
      type: DataFilterType.BACKEND,
      field: 'backlog',
      value: true,
      apply(list) {
        // TODO: Implement
        return list;
      },
    };
  }
}
