import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule
    ]
})
export class UserModule { }