import { NgModule } from '@angular/core';
import FileService from 'src/app/services/file.service';
import { BrowserModule } from '@angular/platform-browser';

import { AuthService } from './services/auth.service';
import KlassyService from './services/klassy.service';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ServerService } from './services/server.service';
import {provideStorage, getStorage} from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TableComponent } from './customer module/table/table.component';
import { RestaurantsComponent } from './customer module/restaurants/restaurants.component';
import { ReserveTableComponent } from './customer module/reserve-table/reserve-table.component';
import { AddRestaurantComponent } from './vendor module/add-restaurant/add-restaurant.component';
import { EditRestaurantsComponent } from './vendor module/edit-restaurants/edit-restaurants.component';
import { ViewRestaurantsComponent } from './vendor module/view-restaurants/view-restaurants.component';
import { ShowReservationComponent } from './vendor module/show-reservation/show-reservation.component';
import { ShowBookedTablesComponent } from './customer module/show-booked-tables/show-booked-tables.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RestaurantsComponent,
    HomeComponent,
    ReserveTableComponent,
    EditRestaurantsComponent,
    ViewRestaurantsComponent,
    AddRestaurantComponent,
    ShowReservationComponent,
    ShowBookedTablesComponent,
    TableComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideStorage(()=>getStorage()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [AuthService, ServerService, FileService, KlassyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
