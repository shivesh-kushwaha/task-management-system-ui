import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { } from '@angular/material/dialog';

import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TokenService } from './services';
import {
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    SearchComponent,
    DialogHeaderComponent,
    NotFoundComponent
} from './components';
import { TableSortHeaderComponent } from './components/table-sort-header/table-sort-header.component';

@NgModule({
    declarations: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        NotFoundComponent,
        SearchComponent,
        DialogHeaderComponent,
        TableSortHeaderComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        ToastrModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,

        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        NotFoundComponent,
        SearchComponent,
        DialogHeaderComponent,
        TableSortHeaderComponent
    ],
    providers: [
        TokenService
    ]
})
export class SharedModule { }