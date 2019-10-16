import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppLoadService } from './app-load.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { TodosModule } from './todos/todos.module';


export function initializeUser(appLoadService: AppLoadService) {
  return () => appLoadService.initializeUser();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Feature modules
    CoreModule,
    SharedModule,

    // AppRouting module must be declared last in order to prevent the ** from catching
    AppRoutingModule,
    TodosModule,

  ],
  providers: [
   AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeUser,
      deps: [AppLoadService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
