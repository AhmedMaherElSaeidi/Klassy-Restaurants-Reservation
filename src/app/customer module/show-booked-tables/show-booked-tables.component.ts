import { Router } from '@angular/router';
import { DocumentSnapshot, collectionSnapshots } from '@angular/fire/firestore';
import { ServerService } from './../../services/server.service';
import { Object } from 'src/app/interface/interface.interface';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './../../services/auth.service';
import KlassyService from 'src/app/services/klassy.service';
import Restaurant from 'src/app/models/restaurant.model';
import { Component, OnInit } from '@angular/core';
import Table from 'src/app/models/table.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-show-booked-tables',
  templateUrl: './show-booked-tables.component.html',
  styleUrls: ['./show-booked-tables.component.css'],
})
export class ShowBookedTablesComponent implements OnInit {
  _reservations?: Object[];
  restaurants?: Object[];
  user?: Object;

  faTrash = faTrash;

  constructor(
    private db: ServerService,
    public Auth: AuthService,
    private router : Router,
    private ks: KlassyService
  ) {}

  get reservations(): Object[] {
    return this.user?.['person'] != undefined
      ? this._reservations?.filter(
          (reservation) =>
            reservation['customerID'] === this.user?.['person'].pid
        )!
      : [];
  }

  get reservationCount(): number {
    let count: number;
    try {
      count = this.reservations.length;
    } catch (error) {}

    return count!;
  }

  getRestaurant(restaurant_id: string): Object {
    return this.restaurants?.filter(
      (restaurant) => restaurant['restaurantID'] === restaurant_id
    )[0]!;
  }

  getRestaurantName(restaurant_id: string): String {
    let restaurantName;
    try {
      restaurantName = this.getRestaurant(restaurant_id)['restaurantName']!;
    } catch (error) {}

    return restaurantName;
  }

  remove(
    reservation_id: string,
    restaurant_id: string,
    table_id: string,
    key: any,
    time_slot: string
  ) {
    // get slot index and object key ready
    let timeslotIndex = this.getRestaurant(restaurant_id)['timeSlots'];
    let valueIndex = this.ks.timeSlots[timeslotIndex].indexOf(time_slot) + 1;

    // get table record
    this.db
      .getRecord(table_id, 'tables')
      .then((data: DocumentSnapshot) => {
        let table = new Table();
        table.constructObject(
          data?.data()?.['tableID'],
          data?.data()?.['restaurantID'],
          data?.data()?.['reservations']
        );

        //remove reservation from table
        table.setSlot('null', table.getReserveKey(key), valueIndex);
        this.db
          .updateRecord(table_id, table.tableObject, 'tables')
          .then(() => {
            //remove reservation from restauant
            let _restaurant = this.restaurants?.filter(
              (restaurant) => restaurant['restaurantID'] === table.restaurantID
            )[0];
            let restaurant = new Restaurant();
            restaurant.constructObject(
              _restaurant?.['vendorID'],
              _restaurant?.['restaurantID'],
              _restaurant?.['restaurantName'],
              _restaurant?.['imgURL'],
              _restaurant?.['category'],
              _restaurant?.['location'],
              _restaurant?.['timeSlots'],
              _restaurant?.['tables'],
              _restaurant?.['description'],
              _restaurant?.['reservations']
            );

            restaurant.removeReservation(reservation_id);
            this.db
              .updateRecord(
                restaurant['restaurantID']!,
                restaurant.restaurantObject,
                'restaurants'
              )
              .then(() => {
                // then remove reservation
                this.db
                  .deleteRecord(reservation_id, 'reservation')
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));

        // success message
        alert('successfully unreserved.');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  authenValidate() {
    if (
      !(
        this.user?.['person'] != undefined &&
        this.user?.['person'].role == 'customer'
      )
    )
      this.router.navigate(['/', 'home']);
  }

  ngOnInit(): void {
    // gets current user
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });

    // return all snapshots

    // get reservations
    collectionSnapshots(this.db.getAll('reservation'))
      .pipe(
        map((allDocs) => {
          return allDocs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
        })
      )
      .subscribe((data) => {
        this._reservations = data;
      });

    // gets all restaurants
    collectionSnapshots(this.db.getAll('restaurants'))
      .pipe(
        map((allDocs) => {
          return allDocs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
        })
      )
      .subscribe((data) => {
        this.restaurants = data;
      });
  }
}
