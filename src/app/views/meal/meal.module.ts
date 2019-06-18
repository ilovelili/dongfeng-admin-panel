import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { MealRoutingModule } from './meal-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { MenuComponent } from './menu.component';
import { AppCsvModule, AppLoadingModule, AppEditButtonModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule, BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { IngredientFilterPipe, MenuFilterPipe, RecipeFilterPipe, ProcurementFilterPipe } from './datafilterpipeline';
import { IngredientComponent } from './ingredient.component';
import { RecipeComponent } from './recipe.component';
import { IngredientNutritionComponent } from './ingredient-nutrition.component';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { ProcurementComponent } from './procurement.component';

@NgModule({
  imports: [
    MealRoutingModule,
    CommonModule,
    ToasterModule,
    AppCsvModule,
    FileUploadModule,
    DataTableModule,
    FormsModule,
    AppLoadingModule,
    AppEditButtonModule,
    NgxTypeaheadModule,
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],  
  declarations: [
    MenuComponent,
    IngredientComponent,
    IngredientNutritionComponent,
    ProcurementComponent,
    RecipeComponent,
    IngredientFilterPipe,
    RecipeFilterPipe,
    MenuFilterPipe,
    ProcurementFilterPipe,
  ]
})
export class MealModule { }
