import { Component, Input } from "@angular/core";
import { LogTypeEnum } from "../../enums";
import { AppUtil } from "../../utils/app.util";

@Component({
    selector: 'app-log-type',
    templateUrl: './log-type.component.html',
    standalone: false
})
export class LogTypeComponent {
    @Input() logType?: LogTypeEnum;

    protected readonly LogTypeEnum = LogTypeEnum;
    protected readonly AppUtil = AppUtil;
}