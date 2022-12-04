import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@dashboard/interfaces/project.interface';
import { ProjectService } from '@dashboard/services/project/project.service';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFilter, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@ngneat/reactive-forms';
import { Observable, EMPTY } from 'rxjs';
import { ConnectedPosition } from '@angular/cdk/overlay';

/** Project tabs component to allow navigate over the project */
@Component({
  selector: 'app-view-options',
  templateUrl: './view-options.component.html',
  styleUrls: ['./view-options.component.scss'],
})
export class ViewOptionsComponent implements OnInit {
  /** @ignore */
  faPenToSquare = faPenToSquare;

  /** @ignore */
  faGithub = faGithub;

  /** @ignore */
  faFilter = faFilter;

  /** Id of the project we are in */
  public projectId!: number;

  /** Observable of the active project */
  project$: Observable<Project> = EMPTY;

  isFiltersOpen = false;

  filtersControl = new FormControl();

  public filtersPositionPairs: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 15,
    },
  ];

  constructor(private activatedRoute: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ projectId }) => {
      this.projectId = Number(projectId);

      this.project$ = this.projectService.get(this.projectId);
    });
  }
}
