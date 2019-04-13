import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { zhCn } from 'ngx-bootstrap/locale'

// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV,
  AppCsvDownloadService,

} from './components';

const APP_COMPONENTS = [
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV,
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, defineLocale } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CallbackComponent } from './callback/callback.component';
import { UserClient } from './clients/user.client';
import { HttpClientModule } from '@angular/common/http';
import { NotificationClient } from './clients/notification.client';
import { FormsModule } from '@angular/forms';
import { ClassClient } from './clients/class.client';
import { AttendanceClient } from './clients/attendance.client';

defineLocale(zhCn.abbr, zhCn);

const APP_CLIENTS = [
  UserClient,  
  NotificationClient,
  ClassClient,
  AttendanceClient,
]

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    CallbackComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
  ],
  providers: [
    AuthService,
    AppCsvDownloadService,
    ...APP_CLIENTS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
