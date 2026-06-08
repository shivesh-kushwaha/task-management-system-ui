import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserManageComponent } from './components';

@NgModule({
    declarations: [
        UserManageComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule
    ]
})
export class UserModule { }