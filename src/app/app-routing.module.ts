import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'auth/login',
//     pathMatch: 'full'
//   },
//   {
//     path: 'auth',
//     canActivate: [AuthGuard],
//     loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
//   },
//   {
//     path: 'users',
//     loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)
//   },
//   {
//     path: '',
//     component: LayoutComponent,
//     canActivate: [AuthGuard],
//     children: [
//       {
//         path: 'dashboard',
//         loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
//       },
//       // {
//       //   path: 'projects',
//       //   loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule)
//       // },
//       // {
//       //   path: 'work-items',
//       //   loadChildren: () => import('./features/work-items/work-items.module').then(m => m.WorkItemsModule)
//       // },
//       // {
//       //   path: 'users',
//       //   loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
//       // }
//     ]
//   },
//   {
//     path: '**',
//     redirectTo: 'auth/login'
//   }
// ];

import { NotFoundComponent } from './shared/components/not-found/not-found.component';

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
  // {
  //   path: 'users',
  //   loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
  // },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'project',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/project/project.module').then(m => m.ProjectModule)
  },
  // {
  //   path: 'work-items',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./features/work-items/work-items.module').then(m => m.WorkItemsModule)
  // },
  {
    path: '**',
    canActivate: [AuthGuard],
    component: NotFoundComponent    // ← show 404 page instead of redirect
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }