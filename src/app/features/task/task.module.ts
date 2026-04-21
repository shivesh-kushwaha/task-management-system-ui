import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TaskRoutingModule } from './task-routing.module';
import {
    TaskManageComponent,
    UpsertTaskDialogComponent,
    WorkItemDetailComponent
} from './components';
import {
    WorkItemService,
    WorkItemStatesService
} from './services';

@NgModule({
    declarations: [
        TaskManageComponent,
        UpsertTaskDialogComponent,
        WorkItemDetailComponent
    ],
    imports: [
        SharedModule,
        TaskRoutingModule,
    ],
    providers: [
        WorkItemService,
        WorkItemStatesService
    ]
})
export class TaskModuleModule { }