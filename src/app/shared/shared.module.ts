import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AlertComponent } from './components/alert/alert.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { FilterByStatusPipe } from './pipes/filter-by-status.pipe';

@NgModule({
  declarations: [
    AlertComponent,
    SearchFilterPipe,
    StopPropagationDirective,
    FilterByStatusPipe
  ],
  imports: [
    CommonModule,
    FormsModule,

    FlexLayoutModule,

    AngularMaterialModule
  ],
  exports: [
    FormsModule,

    FlexLayoutModule,

    AngularMaterialModule,
    AlertComponent,
    SearchFilterPipe,
    FilterByStatusPipe,
    StopPropagationDirective
  ]
})
export class SharedModule { }
