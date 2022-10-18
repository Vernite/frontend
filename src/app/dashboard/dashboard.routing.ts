import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockPage } from '@main/pages/mock/mock.page';
import { CreateWorkspacePage } from './pages/create-workspace/create-workspace.page';
import { EditProjectPage } from './pages/edit-project/edit-project.page';
import { EditWorkspacePage } from './pages/edit-workspace/edit-workspace.page';
import { GithubIntegrationPage } from './pages/github-integration/github-integration.page';
import { ProjectsListPage } from './pages/projects-list/projects-list.page';
import { WorkspacesListPage } from './pages/workspaces-list/workspaces-list.page';
import { CreateProjectPage } from './pages/create-project/create-project.page';

/**
 * Dashboard routes list
 */
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WorkspacesListPage,
  },
  {
    path: 'settings',
    loadChildren: () => import('../settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'github',
    component: GithubIntegrationPage,
    data: {
      hideNavigation: true,
    },
  },
  {
    path: 'dashboard',
    component: MockPage,
    data: {
      image: 'assets/mocks/dashboard.svg',
    },
  },
  {
    path: 'create',
    component: CreateWorkspacePage,
  },
  {
    path: ':workspaceId',
    children: [
      {
        path: 'edit',
        component: EditWorkspacePage,
      },
      {
        path: '',
        pathMatch: 'full',
        component: ProjectsListPage,
      },
      {
        path: 'create',
        component: CreateProjectPage,
      },
      {
        path: ':projectId/edit',
        component: EditProjectPage,
      },
      {
        path: ':projectId',
        loadChildren: () => import('../tasks/tasks.module').then((m) => m.TasksModule),
      },
    ],
  },
];

/**
 * Dashboard routes module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
