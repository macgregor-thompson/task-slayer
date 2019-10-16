import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ExtraOptions } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' }, canDeactivate: [AuthGuard] },
  {
    path: '', component: HomeComponent, canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./todos/todos.module').then(m => m.TodosModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

const routeConfig = {
  preloadingStrategy: PreloadAllModules,
  enableTracing: false,
} as ExtraOptions;

@NgModule({
  imports: [RouterModule.forRoot(routes, routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
