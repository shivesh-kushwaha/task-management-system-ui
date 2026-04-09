import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AppUtil } from "../../../core/utils/app.util";
import { SearchTypeEnum } from "../../../core/enums";
import { ISearchEventDto } from "../../dtos";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    standalone: false
})

export class SearchComponent {
    @Input() label: string = AppUtil.DefaultSearch;
    @Input() inputValue: string = AppUtil.EmptyString;
    @Output() searchEvent: EventEmitter<ISearchEventDto> = new EventEmitter<ISearchEventDto>();

    protected searchFormControl = new FormControl(AppUtil.EmptyString);

    protected onSelectionChange(): void {
        const searchValue = this.searchFormControl.value ?? AppUtil.EmptyString;
        console.log(this.searchFormControl.value)
        if (AppUtil.isNullOrEmpty(searchValue)) {
            this._search(SearchTypeEnum.Search);
        }
    }

    protected onSearch(): void {
        this._search(SearchTypeEnum.Search);
    }

    protected onReset(): void {
        this.searchFormControl.setValue(AppUtil.EmptyString);
        this._search(SearchTypeEnum.Reset);
    }

    private _search(searchTypeEnum: SearchTypeEnum): void {
        const searchValue = this.searchFormControl.value ?? AppUtil.EmptyString;
        this.searchEvent.emit({ query: searchValue, type: searchTypeEnum });
    }
}