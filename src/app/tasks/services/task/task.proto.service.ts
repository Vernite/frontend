import { ProtoService } from '@main/services/proto/proto.service';
import { vernite } from '@vernite/protobuf';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskProtoService {
  public readonly TASK_UPDATED = this.protoService.get<vernite.Task>(
    vernite.Task,
    vernite.BasicAction.UPDATED,
  );

  public readonly TASK_ADDED = this.protoService.get<vernite.Task>(
    vernite.Task,
    vernite.BasicAction.ADDED,
  );

  public readonly TASK_REMOVED = this.protoService.get<vernite.Task>(
    vernite.Task,
    vernite.BasicAction.REMOVED,
  );

  public readonly TASKS = this.protoService.get<vernite.Task>(vernite.Task);

  constructor(private protoService: ProtoService) {}
}