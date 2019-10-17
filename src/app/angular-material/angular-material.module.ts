import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [],
  imports: [
    MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatListModule, MatTabsModule, MatMenuModule, MatButtonModule,
    MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatTooltipModule,
    DragDropModule, MatRippleModule, MatCheckboxModule, MatPaginatorModule
  ],
  exports: [
    MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatListModule, MatTabsModule, MatMenuModule, MatButtonModule,
    MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatTooltipModule,
    DragDropModule, MatRippleModule, MatCheckboxModule, MatPaginatorModule
  ]
})
export class AngularMaterialModule {}
