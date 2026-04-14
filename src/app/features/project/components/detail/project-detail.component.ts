import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProjectTypeEnum, RecordStatusEnum, TeamTypeEnum } from "../../../../core/enums";
import { ProjectService } from "../../services";
import { IGetProjectByIdDto } from "../../dtos";
import { AppUtil } from "../../../../core/utils/app.util";

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    standalone: false
})
export class ProjectDetailComponent implements OnInit {
    protected project: IGetProjectByIdDto | null = null;
    protected isLoading: boolean = true;

    private _id: number = 0;

    protected readonly ProjectTypeEnum = ProjectTypeEnum;
    protected readonly TeamTypeEnum = TeamTypeEnum;
    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly AppUtil = AppUtil;

    constructor(private readonly _projectService: ProjectService,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _toastr: ToastrService) {
        this._id = this._route.snapshot.params['id'];
    }

    public ngOnInit(): void {
        this._loadProject();
    }

    protected onGoBack(): void {
        this._router.navigate(['/project/manage']);
    }

    private _loadProject(): void {
        this.isLoading = true;
        this._projectService.getProjectById(this._id).subscribe({
            next: (response: IGetProjectByIdDto) => {
                this.project = response;
                this.isLoading = false;
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            }
        })
    }
}