import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Modal } from "bootstrap";
import { IGetWorkItemListByIdDto } from "../../../dtos";
import { AppUtil } from "../../../../../core/utils/app.util";
import { Router } from "@angular/router";

@Component({
    selector: 'app-dialog-associated-items',
    templateUrl: './dialog-associated-items.component.html',
    standalone: false,
})
export class DialogAssociatedItemsComponent implements AfterViewInit {
    @ViewChild('dialogAssociatedItems') elementRef!: ElementRef;

    protected associatedWorkItems: IGetWorkItemListByIdDto[];

    protected readonly AppUtil = AppUtil;

    private _modal?: Modal | null;

    constructor(private readonly _router: Router) {
        this.associatedWorkItems = [];
    }

    public ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false,
            });
        }
    }

    public open(model: IGetWorkItemListByIdDto[]): void {
        this.associatedWorkItems = model;
        this._modal?.show();
    }

    protected navigationToProjectDetail(projectId: number): void {
        this._router.navigate(['/project', projectId]);
    }

    protected onClose(): void {
        this._modal?.hide();
    }
}