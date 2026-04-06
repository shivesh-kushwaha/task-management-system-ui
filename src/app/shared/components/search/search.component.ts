import { Component, EventEmitter, Input,  Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AppUtil } from "../../../core/utils/app.util";
import { SearchType } from "../../../core/enums";
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
        console.log(this.searchFormControl.value)
        const searchValue = this.searchFormControl.value ?? AppUtil.EmptyString;
        if (AppUtil.isNullOrEmpty(searchValue)) {
            this.onSearch();
        }
    }

    protected onSearch(): void {
        this._search(SearchType.Search);
    }

    protected onReset(): void {
        this.searchFormControl.setValue(AppUtil.EmptyString);
        this._search(SearchType.Reset);
    }

    private _search(searchType: SearchType): void {
        const searchValue = this.searchFormControl.value ?? AppUtil.EmptyString;
        this.searchEvent.emit({ query: searchValue, type: searchType });
    }
}