import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMemberDialog } from '@dashboard/dialogs/add-member/add-member.dialog';
import { Workspace } from '@dashboard/interfaces/workspace.interface';
import { MemberService } from '@dashboard/services/member.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from '@main/services/dialog.service';
import { maxLengthValidator } from '@main/validators/max-length.validator';
import { Observable, Subscription } from 'rxjs';
import { requiredValidator } from 'src/app/_main/validators/required.validator';
import { ProjectService } from '../../services/project.service';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-create-project-members',
  templateUrl: './create-project-members.page.html',
  styleUrls: ['./create-project-members.page.scss'],
})
export class CreateProjectMembersPage {
  faPlus = faPlus;

  /**
   * Form group for the project creation.
   */
  public form = new FormGroup({
    name: new FormControl('', [requiredValidator(), maxLengthValidator(50)], []),
  });

  /**
   * Subscription to the workspace creation.
   */
  public createSubscription?: Subscription;

  public workspace$!: Observable<Workspace>;

  private workspaceId!: number;

  private memberList?: string[];

  /**
   * Default constructor. Injects the Workspace and Router service.
   * @param workspaceService Workspace service
   * @param router Router service
   */
  constructor(
    private workspaceService: WorkspaceService,
    private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private memberService: MemberService,
  ) {
    const { workspaceId } = this.activatedRoute.snapshot.params;
    this.workspaceId = workspaceId;
    this.workspace$ = this.workspaceService.get(workspaceId);
    this.form.addControl('workspaceId', new FormControl(workspaceId));
  }

  /**
   * Creates a new workspace. Passes the form data to the workspace service. Then navigates to the workspace list if form was valid.
   * Otherwise, displays an error message.
   */

  openAddMembersDialog() {
    this.dialogService
      .open(AddMemberDialog, {})
      .afterClosed()
      .subscribe((result) => {
        this.memberList = result;
      });
  }

  public submitCreate(): void {
    if (!this.createSubscription?.closed && this.createSubscription) return;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    this.createSubscription = this.projectService.create(this.form.value).subscribe((response) => {
      if (this.memberList) {
        this.memberService.add(this.memberList, [response.id]).subscribe(() => {
          this.router.navigate([this.workspaceId]).then(() => {
            window.location.reload();
          });
        });
      } else {
        this.router.navigate([this.workspaceId]).then(() => {
          window.location.reload();
        });
      }
    });
  }
}