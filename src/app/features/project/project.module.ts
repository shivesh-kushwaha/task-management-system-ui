import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectManageComponent } from './components';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectService } from './services/project.service';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ProjectManageComponent
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