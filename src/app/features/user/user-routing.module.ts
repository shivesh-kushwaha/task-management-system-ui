import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../auth/components/register/register.component';
import { UserManageComponent } from './components';

const routes: Routes = [
  {
    path: 'manage',
    component: UserManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }