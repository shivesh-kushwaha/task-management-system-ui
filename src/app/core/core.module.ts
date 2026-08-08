import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors";
import { LogTypeComponent, StatusComponent, TypeComponent } from "./components";

@NgModule({
    declarations: [
        StatusComponent,
        TypeComponent,
        LogTypeComponent
    ],
    exports: [
        StatusComponent,
        TypeComponent,
        LogTypeComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }]
})

export class CoreModule { }