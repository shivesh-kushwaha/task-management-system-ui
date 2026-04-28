import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManageComponent, TaskDetailComponent } from './components';
import { SubTaskDetailComponent } from './components/detail/sub-task/sub-task-detail.component';

const routes: Routes = [
  {
    path: 'manage',
    component: TaskManageComponent
  },
  {
    path: ':id',
    component: TaskDetailComponent,
  },
  {
    path: ':id/sub-task/:subTaskId',
    component: SubTaskDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }