import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TaskRoutingModule } from './task-routing.module';
import {
    TaskManageComponent
} from './components';

@NgModule({
    declarations: [
        TaskManageComponent
    ],
    imports: [
        SharedModule,
        TaskRoutingModule,
    ],
    providers: [

    ]
})
export class TaskModuleModule { }