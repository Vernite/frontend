import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Project } from '@dashboard/interfaces/project.interface';
import { Workspace } from '@dashboard/interfaces/workspace.interface';
import { DialogRef } from '@main/classes/dialog-ref/dialog-ref.class';
import { Service } from '@main/decorators/service/service.decorator';
import { BehaviorSubject, filter } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AlertDialog, AlertDialogData, AlertDialogVariant } from '../../dialogs/alert/alert.dialog';
import { DialogOptions } from './dialog-options.interface';

/** Dialog outlet types enum */
export enum DialogOutlet {
  CONTENT_RIGHT = 'CONTENT_RIGHT',
}

/**
 * Service to manage dialogs.
 */
@Service()
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  /** dialogs map */
  private dialogsMap = new Map();

  /** Dialogs observable registry */
  private dialogs$ = new BehaviorSubject<Map<number, MatDialogRef<unknown, any> | DialogRef>>(
    this.dialogsMap,
  );

  /** Dialog outlets map */
  private outlets = new Map<DialogOutlet, any>();

  /** True if any dialog is open (visible by user). */
  public get isAnyDialogOpen() {
    return this.dialogs$.getValue().size > 0;
  }

  constructor(private matDialog: MatDialog, private injector: Injector) {}

  /**
   * Opens a modal dialog containing the given component.
   * @param component Type of the component to load into the dialog.
   * @param data Object to pass as data to the dialog
   * @returns Reference to the newly-opened dialog.
   */
  open(component: any, data: any = {}, options?: DialogOptions): MatDialogRef<any> | DialogRef {
    let dialog: MatDialogRef<any> | DialogRef;

    if (options?.outlet) {
      const outletComponent = this.outlets.get(options.outlet);

      if (!outletComponent)
        throw new Error(
          `${options.outlet} is not assigned to any dialog outlet component, you need to call registerOutlet()`,
        );

      dialog = outletComponent.renderDialog(component, data, options);
    } else {
      dialog = this.matDialog.open(component, {
        data,
        width: options?.width || '400px',
      });
    }

    const uid = uuid();
    this.dialogsMap.set(uid, dialog);

    dialog.afterClosed().subscribe(() => {
      this.dialogsMap.delete(uid);
      this.dialogs$.next(this.dialogsMap);
    });

    this.dialogs$.next(this.dialogsMap);

    return dialog;
  }

  /**
   * Close all opened dialogs
   */
  closeAll() {
    this.dialogsMap.forEach((dialog) => {
      dialog.close();
    });
  }

  /**
   * Register outlet slot in the dialog service
   * @param outlet outlet to register
   * @param component Component to register as outlet
   */
  registerOutlet(outlet: DialogOutlet, component: any) {
    this.outlets.set(outlet, component);
  }

  /**
   * Opens a alert/information dialog.
   * @param data Object to pass as data to the dialog
   * @returns Reference to the newly-opened dialog.
   */
  alert(data: AlertDialogData) {
    return this.open(AlertDialog, data)
      .afterClosed()
      .pipe(filter((result) => result));
  }

  openErrorDialog(error: string) {
    const data: AlertDialogData = {
      title: 'Error',
      message: error,
      variant: AlertDialogVariant.IMPORTANT,
      cancelText: $localize`Close`,
    };
    return this.alert(data);
  }

  /**
   * Opens a confirm dialog.
   * @param data Object to pass as data to the dialog
   * @returns Reference to the newly-opened dialog.
   */
  confirm(data: AlertDialogData) {
    return this.alert(data);
  }

  /** @TODO Move to project service */
  confirmProjectDelete(project: Project) {
    return this.confirm({
      title: $localize`Delete project "${project.name}"`,
      message: $localize`Are you sure you want to delete project "${project.name}"?`,
      confirmText: $localize`Delete`,
      cancelText: $localize`Cancel`,
      variant: AlertDialogVariant.IMPORTANT,
    });
  }

  /** @TODO Move to workspace service */
  confirmWorkspaceDelete(workspace: Workspace) {
    return this.confirm({
      title: $localize`Delete workspace "${workspace.name}"`,
      message: $localize`Are you sure you want to delete workspace "${workspace.name}"?`,
      confirmText: $localize`Delete`,
      cancelText: $localize`Cancel`,
      variant: AlertDialogVariant.IMPORTANT,
    });
  }
}
