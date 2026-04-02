import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { LayoutComponent, NavbarComponent, SidebarComponent } from './components';
import { TokenService } from './services';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
    declarations: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        NotFoundComponent,
        ToastrModule
    ],
    providers: [
        TokenService
    ]
})
export class SharedModule { }