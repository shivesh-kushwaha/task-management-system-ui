import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManageComponent, WorkItemDetailComponent } from './components';

const routes: Routes = [
  {
    path: 'manage',
    component: TaskManageComponent
  },
  {
    path: ':id',
    component: WorkItemDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }