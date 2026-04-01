import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectManageComponent, UpsertProjectComponent } from './components';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectService } from './services/project.service';

@NgModule({
    declarations: [
        ProjectManageComponent,
        UpsertProjectComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ProjectRoutingModule
    ],
    providers: [
        ProjectService
    ]
})
export class ProjectModule { }