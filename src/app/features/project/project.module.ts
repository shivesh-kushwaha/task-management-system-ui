import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AddProjectDialogComponent, ProjectManageComponent } from './components';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectService } from './services/project.service';
import { ProjectStatesService } from './services/project-states.service';

@NgModule({
    declarations: [
        ProjectManageComponent,
        AddProjectDialogComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ProjectRoutingModule,
    ],
    providers: [
        ProjectService,
        ProjectStatesService
    ]
})
export class ProjectModule { }