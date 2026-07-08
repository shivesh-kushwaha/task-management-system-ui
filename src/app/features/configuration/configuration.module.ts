import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AddPermissionConfigurationDialogComponent, ConfigurationManageComponent, PermissionConfigurationComponent, RoleConfigurationComponent, UpsertPermissionGroupDialogComponent, UpsertRoleConfigurationDialogComponent } from './components';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { PermissionGroupService, PermissionService, RolePermissionService, RoleService, RoleStatesService } from './services';

@NgModule({
    declarations: [
        ConfigurationManageComponent,
        PermissionConfigurationComponent,
        RoleConfigurationComponent,

        AddPermissionConfigurationDialogComponent,
        UpsertPermissionGroupDialogComponent,
        UpsertRoleConfigurationDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ConfigurationRoutingModule
    ],
    providers: [
        PermissionService,
        PermissionGroupService,
        RolePermissionService,

        RoleService,
        RoleStatesService
    ]
})
export class ConfigurationModule { }