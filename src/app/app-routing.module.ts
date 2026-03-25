import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    // children: [
    //   {
    //     path: 'dashboard',
    //     loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
    //   },
    //   {
    //     path: 'projects',
    //     loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule)
    //   },
    //   {
    //     path: 'work-items',
    //     loadChildren: () => import('./features/work-items/work-items.module').then(m => m.WorkItemsModule)
    //   },
    //   {
    //     path: 'users',
    //     loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
    //   }
    // ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }