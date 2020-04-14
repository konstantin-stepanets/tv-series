import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Pipes
import { GenrePipe } from './pipes/genrePipe';

// Components
import { PaginatorComponent } from './components/paginator.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    // Components
    PaginatorComponent,
    // Pipes
    GenrePipe
  ],
  providers: [],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Components
    PaginatorComponent,
    // Pipes
    GenrePipe

  ]
})
export class SharedModule {}
