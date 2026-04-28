import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TaskRoutingModule } from './task-routing.module';
import {
    TaskManageComponent,
    TaskDetailComponent,
    SubTaskDetailComponent
} from './components';

@NgModule({
    declarations: [
        TaskManageComponent,
        TaskDetailComponent,
        SubTaskDetailComponent
    ],
    imports: [
        SharedModule,
        TaskRoutingModule,
    ],
    providers: [
    ]
})
export class TaskModuleModule { }