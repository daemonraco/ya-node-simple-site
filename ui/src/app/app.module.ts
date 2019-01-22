import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DRToolsModule } from 'ng-drtools';
import { HttpClientModule } from '@angular/common/http';

import { AppInitFactory } from './app.init';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BasicsModule } from './basics/basics.module';
import { PagesModule } from './pages/pages.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        BasicsModule,
        BrowserModule,
        DRToolsModule,
        HttpClientModule,
        PagesModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: AppInitFactory,
            deps: [
            ],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
