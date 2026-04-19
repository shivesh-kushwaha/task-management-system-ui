import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import {
    TeamService,
    ProjectService,
    ProjectStatesService
} from './services';
import {
    ProjectDetailComponent, 
    ProjectManageComponent, 
    UpsertProjectDialogComponent} from './components';

@NgModule({
    declarations: [
        ProjectManageComponent,
        ProjectDetailComponent,
        UpsertProjectDialogComponent
    ],
    imports: [
        SharedModule,
        ProjectRoutingModule,
    ],
    providers: [
        ProjectService,
        ProjectStatesService,
        TeamService
    ]
})
export class ProjectModule { }