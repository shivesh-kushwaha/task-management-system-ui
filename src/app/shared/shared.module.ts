import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { } from '@angular/material/dialog';

import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AttachmentService, AuthService, DialogStatesService, ProjectService, TokenService, UserService, WorkItemService, WorkItemStatesService, WorkItemTypeService } from './services';
import {
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    SearchComponent,
    DialogHeaderComponent,
    NotFoundComponent,
    DialogConfirmComponent,
    PaginationComponent,
    WorkItemManageComponent,
    UpsertWorkItemDialogComponent,
    CommentManageComponent,
    SideDrawerComponent,
    CommentUpsertComponent,
} from './components';
import { TableSortHeaderComponent } from './components/table-sort-header/table-sort-header.component';
import { WorkItemDetailComponent } from './components/work-item/detail/work-item-detail.component';
import { CommentService } from './services/comment.service';

@NgModule({
    declarations: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        NotFoundComponent,
        SearchComponent,
        TableSortHeaderComponent,
        PaginationComponent,
        WorkItemManageComponent,
        WorkItemDetailComponent,
        UpsertWorkItemDialogComponent,
        CommentManageComponent,
        DialogHeaderComponent,
        DialogConfirmComponent,
        SideDrawerComponent,
        CommentUpsertComponent,
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
        SideDrawerComponent,

        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        NotFoundComponent,
        SearchComponent,
        TableSortHeaderComponent,
        PaginationComponent,
        WorkItemManageComponent,
        WorkItemDetailComponent,
        UpsertWorkItemDialogComponent,
        CommentManageComponent,

        DialogHeaderComponent,
        DialogConfirmComponent,
        CommentUpsertComponent,
    ],
    providers: [
        AuthService,
        TokenService,
        DialogStatesService,

        ProjectService,
        WorkItemTypeService,
        WorkItemService,
        WorkItemStatesService,
        UserService,
        AttachmentService,
        CommentService
    ]
})
export class SharedModule { }