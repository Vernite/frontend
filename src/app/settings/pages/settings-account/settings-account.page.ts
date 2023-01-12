import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { AuthService } from '@auth/services/auth/auth.service';
import { UserService } from '@auth/services/user/user.service';
import { requiredValidator } from '@main/validators/required.validator';
import { SnackbarService } from '@main/services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { notEmptyValidator } from '@main/validators/not-empty.validator';
import { maxLengthValidator } from '@main/validators/max-length.validator';

/**
 * Settings account page component
 */
@Component({
  selector: 'app-settings-account-page',
  templateUrl: './settings-account.page.html',
  styleUrls: ['./settings-account.page.scss'],
})
export class SettingsAccountPage implements OnInit {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {}

  /** Form to edit account data */
  public form = new FormGroup({
    email: new FormControl('', requiredValidator()),
    name: new FormControl('', [requiredValidator(), notEmptyValidator(), maxLengthValidator(100)]),
    surname: new FormControl('', [
      requiredValidator(),
      notEmptyValidator(),
      maxLengthValidator(100),
    ]),
    username: new FormControl('', requiredValidator()),
  });

  ngOnInit() {
    this.userService.getMyself().subscribe((response) => {
      this.form.patchValue(response);
    });
  }

  /**
   * Submit form to update account data
   */
  submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    this.userService.update(this.form.value).subscribe(() => {
      this.snackbarService.show($localize`Account updated successfully`);
    });
  }

  /**
   * Change password
   * @TODO Add confirmation dialog
   */
  changePassword() {
    this.authService.openChangePasswordDialog().subscribe();
  }

  /**
   * Delete account
   * @TODO Add confirmation dialog
   */
  deleteAccountMailCheck() {
    this.authService.deleteAccountWithConfirmation().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
