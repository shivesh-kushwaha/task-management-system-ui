import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailComponent, ProjectManageComponent } from './components';

const routes: Routes = [
  {
    path: 'manage',
    component: ProjectManageComponent
  },
  {
    path: ':id',
    component: ProjectDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }