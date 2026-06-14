import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import { RecordStatusEnum, WorkItemTypeEnum } from "../../../../core/enums";
import { AppUtil } from "../../../../core/utils/app.util";
import { WorkItemService } from "../../../services";
import { IGetWorkItemByIdDto } from "../../../dtos";

@Component({
    selector: 'app-work-item-detail',
    templateUrl: './work-item-detail.component.html',
    standalone: false
})
export class WorkItemDetailComponent implements OnInit {
    @Input() id: number = 0;
    @Input() parentId: number = 0;
    @Input() workItemType: WorkItemTypeEnum = WorkItemTypeEnum.task;

    protected workItem: IGetWorkItemByIdDto | null = null;
    protected isLoading: boolean = true;

    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly WorkItemTypeEnum = WorkItemTypeEnum;
    protected readonly AppUtil = AppUtil;

    constructor(private readonly _workItemService: WorkItemService,
        private readonly _router: Router,
        private readonly _toastr: ToastrService) {
    }

    public ngOnInit(): void {
        this._loadWorkItem();
    }

    protected onGoBack(): void {
        if (this.workItemType === this.WorkItemTypeEnum.task) {
            this._router.navigate(['/task/manage']);
        } else {
            this._router.navigate(['/task', this.parentId]);
        }
    }

    private _loadWorkItem(): void {
        this._workItemService.getById(this.id).pipe(take(1)).subscribe({
            next: (response: IGetWorkItemByIdDto) => {
                this.workItem = response;
                this.isLoading = false;
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            }
        });
    }
}