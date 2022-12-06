import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth/auth.service';
import { UserService } from '@auth/services/user/user.service';
import { WorkspaceService } from '@dashboard/services/workspace/workspace.service';
import { faAngleDown, faCog, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from '@main/services/dialog/dialog.service';
import { TaskService } from '@tasks/services/task/task.service';
import { finalize, fromEvent, map, skip, take, catchError, throwError, Observable } from 'rxjs';

@Component({
  selector: 'app-upper-navigation',
  templateUrl: './upper-navigation.component.html',
  styleUrls: ['./upper-navigation.component.scss'],
})
export class UpperNavigationComponent implements OnInit {
  @ViewChild('openBelow') openBelow!: ElementRef<HTMLElement>;

  faAngleDown = faAngleDown;
  faUser = faUser;
  faCog = faCog;
  faSignOut = faSignOut;

  public active: boolean = false;
  public _isButtonDisabled = true;

  public myself$?: Observable<User>;

  constructor(
    private dialogService: DialogService,
    private taskService: TaskService,
    private workspaceService: WorkspaceService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.workspaceService.list().pipe(
      map((workspaces) => {
        if (workspaces.length === 0) {
          this._isButtonDisabled = false;
        } else if (
          workspaces.filter((workspace) => workspace.projectsWithPrivileges.length).length === 0
        ) {
          this._isButtonDisabled = false;
        } else {
          this._isButtonDisabled = true;
        }
      }),
    );

    this.myself$ = this.userService.getMyself();
  }

  createNewTask() {
    this.taskService.openCreateNewTaskDialog().subscribe(() => {
      location.reload();
    });
  }

  logout() {
    this.authService
      .logout()
      .pipe(
        catchError(() => {
          location.reload();
          return throwError(() => new Error());
        }),
        finalize(() => {
          this.router.navigate(['/', 'auth', 'login']);
        }),
      )
      .subscribe();
  }

  public isButtonDisabled() {
    return this._isButtonDisabled;
  }

  public openProfile() {
    this.active = true;
    fromEvent(document, 'click')
      .pipe(skip(1), take(1))
      .subscribe(() => {
        this.closeProfile();
      });
  }

  public closeProfile() {
    this.active = false;
  }

  public toggleProfile() {
    if (!this.active) {
      this.openProfile();
    } else {
      this.closeProfile();
    }
  }
}
