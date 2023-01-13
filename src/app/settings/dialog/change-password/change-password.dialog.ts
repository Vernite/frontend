import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { requiredValidator } from '@main/validators/required.validator';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { validateForm } from '@main/classes/form.class';
import { AuthService } from '@auth/services/auth/auth.service';
import { SnackbarService } from '@main/services/snackbar/snackbar.service';
import { catchError, throwError } from 'rxjs';
import { withLoader } from '@main/operators/loader.operator';
import { Loader } from '@main/classes/loader/loader.class';
import { passwordValidator } from '@main/validators/password.validator';
import { sameAsValidator } from '@main/validators/same-as.validator';
import { maxLengthValidator } from '@main/validators/max-length.validator';

/**
 * Change password dialog component
 */
@Component({
  selector: 'change-password-dialog',
  templateUrl: './change-password.dialog.html',
  styleUrls: ['./change-password.dialog.scss'],
})
export class ChangePasswordDialog {
  /**
   * Login error
   */
  public error?: string;

  /**
   * Loader
   */
  public loader = new Loader();

  /** Change password dialog form */
  public form = new FormGroup({
    oldPassword: new FormControl('', [
      requiredValidator(),
      passwordValidator(),
      maxLengthValidator(100),
    ]),
    newPassword: new FormControl('', [
      requiredValidator(),
      passwordValidator(),
      maxLengthValidator(100),
    ]),
    rep_newPassword: new FormControl('', [
      requiredValidator(),
      passwordValidator(),
      maxLengthValidator(100),
      sameAsValidator('newPassword', $localize`Given passwords are not the same`),
    ]),
  });

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialog>,
    private authService: AuthService,
    private snackbarService: SnackbarService,
  ) {}

  /**
   * Cancel dialog
   */
  cancel() {
    this.dialogRef.close();
  }

  /**
   * Closes dialog
   */
  save() {
    if (validateForm(this.form)) {
      this.error = undefined;
      let data = this.form.value;
      this.authService
        .changePassword(data.oldPassword, data.newPassword)
        .pipe(
          withLoader(this.loader),
          catchError((error) => {
            this.handleError(error);
            return throwError(() => new Error(error));
          }),
        )
        .subscribe(() => {
          this.dialogRef.close();
          this.snackbarService.show($localize`Password changed successfully!`);
        });
    }
  }

  /**
   * Handle chaneg password error
   * @param error Error
   */
  handleError(error: any) {
    switch (error.status) {
      case 404:
        this.error = $localize`Current password is incorrect.`;
        break;
    }
  }
}
