import { Component } from '@angular/core';
import { WorkItemTypeEnum } from '../../../../core/enums';
@Component({
    selector: 'app-task-manage',
    templateUrl: './task-manage.component.html',
    standalone: false,
})
export class TaskManageComponent {
    protected readonly WorkItemTypeEnum = WorkItemTypeEnum;
}