import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Router } from '@angular/router';
import { maxLengthValidator } from '@main/validators/max-length.validator';
import { Subscription } from 'rxjs';
import { Page } from '@main/decorators/page/page.decorator';
import { requiredValidator } from 'src/app/_main/validators/required.validator';
import { WorkspaceService } from '../../services/workspace/workspace.service';

/**
 * Create workspace page component.
 */
@Page()
@Component({
  selector: 'app-create-workspace-page',
  templateUrl: './create-workspace.page.html',
  styleUrls: ['./create-workspace.page.scss'],
})
export class CreateWorkspacePage {
  /**
   * Form group for the workspace creation.
   */
  public form = new FormGroup({
    name: new FormControl('', [requiredValidator(), maxLengthValidator(50)], []),
  });

  /**
   * Subscription to the workspace creation.
   */
  public createSubscription?: Subscription;

  /**
   * Default constructor. Injects the Workspace and Router service.
   * @param workspaceService Workspace service
   * @param router Router service
   */
  constructor(private workspaceService: WorkspaceService, private router: Router) {}

  /**
   * Creates a new workspace. Passes the form data to the workspace service. Then navigates to the workspace list if form was valid.
   * Otherwise, displays an error message.
   */
  public submitCreate(): void {
    if (!this.createSubscription?.closed && this.createSubscription) return;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    this.createSubscription = this.workspaceService.create(this.form.value).subscribe(() => {
      this.router.navigate(['/workspaces']).then(() => {
        window.location.reload();
      });
    });
  }
}
