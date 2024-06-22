import { ServerService } from './../../services/server.service';
import { collectionSnapshots } from '@angular/fire/firestore';
import { Object } from '../../interface/interface.interface';
import KlassyService from 'src/app/services/klassy.service';
import { AuthService } from './../../services/auth.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import FileService from 'src/app/services/file.service';
import { Component, OnInit } from '@angular/core';
import Vendor from 'src/app/models/vendor.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-view-restaurants',
  templateUrl: './view-restaurants.component.html',
  styleUrls: ['./view-restaurants.component.css'],
})
export class ViewRestaurantsComponent implements OnInit {
  _restaurants: any[] = [];
  user?: Object;

  faTrash = faTrash;

  constructor(
    private fileSer: FileService,
    private ks: KlassyService,
    public Auth: AuthService,
    private db: ServerService
  ) {}

  getIMG(image_url: string) {
    return this.fileSer.getFile(image_url);
  }

  getTimeSlots(index: number): string[] {
    return this.ks.timeSlots[index];
  }

  get restaurants() {
    return this._restaurants.filter((restaurant) =>
      this.user?.['person'].restaurants.includes(restaurant.id)
    );
  }

  removeReservations(restaurant_id: string) {
    // gets reservations id
    let reservations = this.restaurants
      .filter((restaurant) => restaurant.id === restaurant_id)
      .map((restaurant) => restaurant.reservations)[0];

    reservations.forEach((reservation: string) => {
      this.db
        .deleteRecord(reservation, 'reservation')
        .catch((error) => console.log(error));
    });
  }

  removeTables(restaurant_id: string) {
    // gets tables id
    let tables = this.restaurants
      .filter((restaurant) => restaurant.id === restaurant_id)
      .map((restaurant) => restaurant.tables)[0];

    tables.forEach((table: string) => {
      this.db
        .deleteRecord(table, 'tables')
        .catch((error) => console.log(error));
    });
  }

  removeRestaurant(restaurant_id: string, img_ref: string) {
    // construct vendor object
    let vendor = new Vendor();
    vendor.constructObject(
      this.user?.['person'].pid,
      this.user?.['person'].name,
      this.user?.['person'].email,
      this.user?.['person'].gender,
      this.user?.['person'].role,
      this.user?.['person'].restaurants
    );

    // Removing restaurant tables
    this.removeTables(restaurant_id);

    // Removing restaurant reservations
    this.removeReservations(restaurant_id);

    // Update vendor data
    vendor.removeRestaurant(restaurant_id);
    this.db
      .updateRecord(this.user?.['person'].pid, vendor.personObject, 'users')
      .then(() => {
        // Removing restaurant image
        this.fileSer.deleteFile(img_ref);

        // Removing restaurant
        this.db
          .deleteRecord(restaurant_id, 'restaurants')
          .catch((error) => console.log(error));

        // success message
        alert('Removed!');
      })
      .catch((error) => console.log(error));
  }

  ngOnInit(): void {
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });

    // return all snapshots of restaurants
    collectionSnapshots(this.db.getAll('restaurants'))
      .pipe(
        map((allDocs) => {
          return allDocs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
        })
      )
      .subscribe((data) => {
        this._restaurants = data;
      });
  }
}
