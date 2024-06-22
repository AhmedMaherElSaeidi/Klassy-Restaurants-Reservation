import { ServerService } from './../../services/server.service';
import { Object } from 'src/app/interface/interface.interface';
import { collectionSnapshots } from '@angular/fire/firestore';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-show-reservation',
  templateUrl: './show-reservation.component.html',
  styleUrls: ['./show-reservation.component.css'],
})
export class ShowReservationComponent implements OnInit {
  _reservations?: Object[];
  _restaurants?: Object[];
  _users?: Object[];
  user?: Object;

  constructor(private db: ServerService, public Auth: AuthService) {}

  get reservationsLen() : number {
    let len : number;
    try {
      len = this.reservations.length;
    } catch (error) {}

    return len!;
  }

  get reservations(): Object[] {
    return this._reservations?.filter((reservation) =>
      this.user?.['person']?.restaurants.includes(reservation?.['restaurantID'])
    )!;
  }

  getRestaurant(restaurant_id: string): Object {
    return this._restaurants?.filter(
      (restaurant) => restaurant['restaurantID'] === restaurant_id
    )[0]!;
  }

  getRestaurantName(restaurant_id: string): string {
    let rname;
    try {
      rname = this.getRestaurant(restaurant_id)['restaurantName'];
    } catch (error) {}

    return rname;
  }

  getUser(user_id: string): Object {
    return this._users?.filter((user) => user['pid'] === user_id)[0]!;
  }

  getUserName(user_id: string): string {
    let uname;
    try {
      uname = this.getUser(user_id)['name'];
    } catch (error) {}

    return uname;
  }

  ngOnInit(): void {
    // gets current user
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });

    // get all reservations
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
        this._restaurants = data;
      });

    // gets all users
    collectionSnapshots(this.db.getAll('users'))
      .pipe(
        map((allDocs) => {
          return allDocs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
        })
      )
      .subscribe((data) => {
        this._users = data;
      });
  }
}
