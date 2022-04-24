import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { requiredValidator } from 'src/app/_main/validators/required.validator';
import { ProjectService } from '../../services/project.service';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.page.html',
  styleUrls: ['./create-project.page.scss'],
})
export class CreateProjectPage {
  /**
   * Form group for the project creation.
   */
  public form = new FormGroup({
    name: new FormControl('', [requiredValidator()], []),
  });

  /**
   * Subscription to the workspace creation.
   */
  public createSubscription?: Subscription;

  private workspaceId!: number;

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
  ) {
    const { workspaceId } = this.activatedRoute.snapshot.params;
    this.workspaceId = workspaceId;
    this.form.addControl('workspaceId', new FormControl(workspaceId));
  }

  /**
   * Creates a new workspace. Passes the form data to the workspace service. Then navigates to the workspace list if form was valid.
   * Otherwise, displays an error message.
   */
  public submitCreate(): void {
    if (!this.createSubscription?.closed && this.createSubscription) return;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    this.createSubscription = this.projectService.create(this.form.value).subscribe(() => {
      this.router.navigate([this.workspaceId]);
    });
  }
}
