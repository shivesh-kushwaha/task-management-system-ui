import { Component, } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WorkItemTypeEnum } from "../../../../core/enums";

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    standalone: false
})
export class TaskDetailComponent {
    protected id: number = 0;
    protected readonly WorkItemTypeEnum = WorkItemTypeEnum;

    constructor(private readonly _route: ActivatedRoute) {
        this.id = this._route.snapshot.params['id'];
    }
}