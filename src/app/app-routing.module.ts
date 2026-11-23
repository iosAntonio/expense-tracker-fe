
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { ImportComponent } from './pages/import/import.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'expenses',
    pathMatch: 'full'
  },
  {
    path: 'expenses',
    component: ExpensesComponent
  },
  {
    path: 'import',
    component: ImportComponent
  },
  {
    path: '**',
    redirectTo: 'expenses'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
