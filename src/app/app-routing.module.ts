import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './pages/search/search.component';
import { NewConceptComponent } from './pages/new-concept/new-concept.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'concept/new', component: NewConceptComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
