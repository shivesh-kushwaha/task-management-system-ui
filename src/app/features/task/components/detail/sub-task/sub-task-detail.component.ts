import { Component, } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WorkItemTypeEnum } from "../../../../../core/enums";

@Component({
    selector: 'app-sub-task-detail',
    templateUrl: './sub-task-detail.component.html',
    standalone: false
})
export class SubTaskDetailComponent {
    protected parentId: number = 0;
    protected id: number = 0;
    protected readonly WorkItemTypeEnum = WorkItemTypeEnum;

    constructor(private readonly _route: ActivatedRoute) {
        this.parentId = this._route.snapshot.params['id'];
        this.id = this._route.snapshot.params['subTaskId'];
    }
}