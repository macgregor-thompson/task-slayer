import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosComponent } from './todos.component';


const routes: Routes = [
  // { path: ':id', component: TodoComponent, data: { title: 'To-Do\'s'} }
  {path: '', component: TodosComponent, data: {title: 'To-Do\'s'}},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule {
}
