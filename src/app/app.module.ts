import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ImportComponent } from './pages/import/import.component';
import { ToastComponent } from './layout/toast/toast.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ExpenseEditDialogComponent } from './pages/expenses/expense-edit-dialog/expense-edit-dialog.component';
import { PeriodSelectorComponent } from './pages/expenses/period-selector/period-selector.component';
import { YearOverviewComponent } from './pages/dashboard/year-overview/year-overview.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryFilterComponent } from './shared/category-filter/category-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ExpensesComponent,
    SidebarComponent,
    ImportComponent,
    ToastComponent,
    ConfirmDialogComponent,
    ExpenseEditDialogComponent,
    PeriodSelectorComponent,
    YearOverviewComponent,
    DashboardComponent,
    CategoryFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }