import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AddPermissionConfigurationDialogComponent, ConfigurationManageComponent, ExceptionLogComponent, ExceptionLogDetailComponent, PermissionConfigurationComponent, RoleConfigurationComponent, UpsertPermissionGroupDialogComponent, UpsertRoleConfigurationDialogComponent } from './components';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ExceptionLogService, PermissionGroupService, PermissionService, RolePermissionService, RoleService, RoleStatesService } from './services';
import { CoreModule } from '../../core/core.module';

@NgModule({
    declarations: [
        ConfigurationManageComponent,
        PermissionConfigurationComponent,
        RoleConfigurationComponent,

        AddPermissionConfigurationDialogComponent,
        UpsertPermissionGroupDialogComponent,
        UpsertRoleConfigurationDialogComponent,

        ExceptionLogComponent,
        ExceptionLogDetailComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        SharedModule,
        ConfigurationRoutingModule
    ],
    providers: [
        PermissionService,
        PermissionGroupService,
        RolePermissionService,

        RoleService,
        RoleStatesService,
        ExceptionLogService
    ]
})
export class ConfigurationModule { }