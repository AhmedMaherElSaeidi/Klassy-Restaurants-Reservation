import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RestaurantsComponent } from './customer module/restaurants/restaurants.component';
import { ReserveTableComponent } from './customer module/reserve-table/reserve-table.component';
import { EditRestaurantsComponent } from './vendor module/edit-restaurants/edit-restaurants.component';
import { ShowBookedTablesComponent } from './customer module/show-booked-tables/show-booked-tables.component';
import { ViewRestaurantsComponent } from './vendor module/view-restaurants/view-restaurants.component';
import { AddRestaurantComponent } from './vendor module/add-restaurant/add-restaurant.component';
import { ShowReservationComponent } from './vendor module/show-reservation/show-reservation.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reserve-table/:id', component: ReserveTableComponent },
  { path: 'show-restaurants', component: RestaurantsComponent },
  {
    path: 'edit-restaurants',
    component: EditRestaurantsComponent,
    children: [
      { path: '', redirectTo: 'show-restaurants', pathMatch: 'full' },
      { path: 'show-restaurants', component: ViewRestaurantsComponent },
      { path: 'add-restaurants', component: AddRestaurantComponent },
      { path: 'show-reservation', component: ShowReservationComponent },
    ],
  },
  { path: 'show-booked-tables', component: ShowBookedTablesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
