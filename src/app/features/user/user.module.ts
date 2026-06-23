import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { DialogAssociatedItemsComponent, UserManageComponent } from './components';
import { UpsertUserDialogComponent } from './components/dialogs/upsert/upsert-user-dialog.component';
import { RoleService, UserStatesService } from './services';

@NgModule({
    declarations: [
        UserManageComponent,
        DialogAssociatedItemsComponent,
        UpsertUserDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule
    ],
    providers: [
        RoleService,
        UserStatesService
    ]
})
export class UserModule { }