import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutComponent, NavbarComponent, SidebarComponent } from './components';
import { TokenService } from './services';

@NgModule({
    declarations: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        LayoutComponent,
        SidebarComponent,
        NavbarComponent
    ],
    providers: [
        TokenService
    ]
})
export class SharedModule { }