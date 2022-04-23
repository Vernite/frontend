import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../services/workspace.service';
import { map, Observable } from 'rxjs';
import { Project } from '../../interfaces/project.interface';
import { Workspace } from '../../interfaces/workspace.interface';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.page.html',
  styleUrls: ['./projects-list.page.scss'],
})
export class ProjectsListPage implements OnInit {
  workspace$: Observable<Workspace>;
  projects$: Observable<Project[]>;

  faPlus = faPlus;

  constructor(private activatedRoute: ActivatedRoute, private workspaceService: WorkspaceService) {
    const { id } = this.activatedRoute.snapshot.params;

    this.workspace$ = this.workspaceService.get(id);
    this.projects$ = this.workspace$.pipe(
      map((workspace) => workspace.projectsWithPrivileges.map((project) => project.project)),
    );
  }

  public editProject(project: Project) {}

  public deleteProject(project: Project) {}

  ngOnInit() {}
}
