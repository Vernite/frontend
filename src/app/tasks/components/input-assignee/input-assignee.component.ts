import { Input, Component, ChangeDetectorRef, Optional } from '@angular/core';
import { ControlAccessor } from '@main/classes/control-accessor.class';
import { ProjectMember } from '../../../dashboard/interfaces/project-member.interface';
import { NgControl } from '@angular/forms';
import { memoize } from 'lodash-es';

@Component({
  selector: 'input-assignee',
  templateUrl: './input-assignee.component.html',
  styleUrls: ['./input-assignee.component.scss'],
})
export class InputAssigneeComponent extends ControlAccessor {
  @Input() members!: ProjectMember[];

  constructor(
    @Optional() public override ngControl: NgControl,
    protected override cdRef: ChangeDetectorRef,
  ) {
    super(ngControl, cdRef);

    this.memberById = memoize(this.memberById.bind(this));
  }

  public memberById(id: number): ProjectMember | undefined {
    return this.members.find((member) => member.user.id === id);
  }
}
