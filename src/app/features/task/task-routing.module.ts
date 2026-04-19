import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManageComponent } from './components';

const routes: Routes = [
  {
    path: 'manage',
    component: TaskManageComponent
  },
//   {
//     path: ':id',
//     component: TaskManageComponent
//   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }