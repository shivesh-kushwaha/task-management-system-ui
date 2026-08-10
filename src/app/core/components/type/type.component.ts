import { Component, Input } from "@angular/core";
import { TypeEnum } from "../../enums";
import { AppUtil } from "../../utils/app.util";

@Component({
    selector: 'app-type',
    templateUrl: './type.component.html',
    standalone: false
})
export class TypeComponent {
    @Input() type?: TypeEnum = TypeEnum.Other;

    protected readonly TypeEnum = TypeEnum;
    protected readonly AppUtil = AppUtil;
}