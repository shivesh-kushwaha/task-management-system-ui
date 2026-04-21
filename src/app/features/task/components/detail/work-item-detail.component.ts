import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IGetWorkItemByIdDto } from "../../dtos/get-work-item-by-id.dto";
import { RecordStatusEnum } from "../../../../core/enums";
import { AppUtil } from "../../../../core/utils/app.util";
import { WorkItemService } from "../../services";
import { take } from "rxjs";

@Component({
    selector: 'app-work-item-detail',
    templateUrl: './work-item-detail.component.html',
    standalone: false
})
export class WorkItemDetailComponent implements OnInit {
    protected workItem: IGetWorkItemByIdDto | null = null;
    protected isLoading: boolean = true;

    private _id: number = 0;

    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly AppUtil = AppUtil;

    constructor(private readonly _workItemService: WorkItemService,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _toastr: ToastrService) {
        this._id = this._route.snapshot.params['id'];
    }

    public ngOnInit(): void {
        this._loadWorkItem();
    }

    protected onGoBack(): void {
        this._router.navigate(['/task/manage']);
    }

    private _loadWorkItem(): void {
        this.isLoading = true;
        this._workItemService.getById(this._id).pipe(take(1)).subscribe({
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