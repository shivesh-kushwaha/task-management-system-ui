import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationManageComponent, ExceptionLogComponent, ExceptionLogDetailComponent, PermissionConfigurationComponent, RoleConfigurationComponent } from './components';

const routes: Routes = [
    {
        path: 'manage',
        component: ConfigurationManageComponent,
        children: [
            {
                path: 'permission',
                component: PermissionConfigurationComponent
            },
            {
                path: 'role',
                component: RoleConfigurationComponent
            },
            {
                path: 'exception-log',
                component: ExceptionLogComponent
            },
            {
                path: 'exception-log/:id',
                component: ExceptionLogDetailComponent
            },
            {
                path: '',
                redirectTo: 'permission',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConfigurationRoutingModule { }