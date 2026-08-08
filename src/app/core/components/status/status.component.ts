import { Component, Input } from "@angular/core";
import { RecordStatusEnum } from "../../enums";
import { AppUtil } from "../../utils/app.util";

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    standalone: false
})
export class StatusComponent {
    @Input() status?: RecordStatusEnum;

    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly AppUtil = AppUtil;
}