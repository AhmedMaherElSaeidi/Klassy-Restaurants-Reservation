import { DocumentSnapshot, collectionSnapshots } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServerService } from './../../services/server.service';
import KlassyService from 'src/app/services/klassy.service';
import { AuthService } from './../../services/auth.service';
import Restaurant from 'src/app/models/restaurant.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  faUser,
  faClock,
  faCalendar,
  faArrowDown,
  faUserPlus,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { Object } from 'src/app/interface/interface.interface';
import Reservation from 'src/app/models/reservation.model';
import Table from 'src/app/models/table.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-reserveTable',
  templateUrl: './reserve-table.component.html',
  styleUrls: ['./reserve-table.component.css'],
})
export class ReserveTableComponent implements OnInit {
  faUser = faUser;
  faClock = faClock;
  faTable = faTable;
  faUserPlus = faUserPlus;
  faCalendar = faCalendar;
  faArrowDown = faArrowDown;

  guests: number[] = [1, 2, 3, 4, 5, 6];
  reservationForm?: FormGroup;
  restaurant?: Restaurant;
  restaurant_id?: string;
  seatsCount?: number;
  tables?: Object[];
  table?: Table;
  user?: Object;

  constructor(
    private ks: KlassyService,
    private route: ActivatedRoute,
    private router: Router,
    private db: ServerService,
    public Auth: AuthService
  ) {}

  getSeatsCount(target: any) {
    // value passes down to table component
    this.seatsCount = target.value;
  }

  get restaurantTimeSlots(): string[] {
    return this.ks.timeSlots[+this.restaurant?.timeSlots!];
  }

  get showTimeSlots(): boolean {
    let bool =
      this.reservationForm?.value.table != null &&
      this.reservationForm?.value.table != 'null' &&
      this.reservationForm?.value.table != null &&
      this.reservationForm?.value.date != '';

    return bool;
  }

  get validateDate(): boolean {
    let currentDate = new Date(`${KlassyService.currentDate} 00:00:00`);
    let selectedDate = new Date(`${this.reservationForm?.value.date} 00:00:00`);

    return selectedDate.getTime() < currentDate.getTime() ? true : false;
  }

  get availableSlots(): any[][] {
    let dateKey = +this.reservationForm?.value.date.replaceAll('-', '');
    let taleID = this.reservationForm?.value.table;
    let _table = this.tables?.filter((table) => table['id'] === taleID)[0];

    let table = new Table();
    table.constructObject(
      _table?.['tableID'],
      _table?.['restaurantID'],
      _table?.['reservations']
    );

    this.table = table;
    let slots = [0, 1, 2, 3, 4];
    let slots2D = [];
    let availableSlots = this.table?.getSlotsAvailable(dateKey)!;
    for (let index = 0; index < slots.length; index++) {
      let temp = [slots[index], availableSlots.includes(slots[index])];
      slots2D.push(temp);
    }

    return slots2D;
  }

  reset() {
    // reset form and intialize values with defaults.
    this.reservationForm?.reset();
    this.reservationForm?.patchValue({
      name: this.user?.['person'].name,
      table: null,
      date: KlassyService.currentDate,
      time: null,
      guests: null,
    });
  }

  reserve() {
    // check if date is valid
    if (this.validateDate) {
      alert('pls select a valid date');
      return;
    }

    // get table details
    let table = new Table();
    this.db
      .getRecord(this.reservationForm?.value.table, 'tables')
      .then((data: DocumentSnapshot) => {
        table?.constructObject(
          data?.data()?.['tableID'],
          data?.data()?.['restaurantID'],
          data?.data()?.['reservations']
        );

        // table {'datekey': ['timeslotindex', 'null', 'null', 'null', 'null', 'null']}
        // check if there's a reservation already with same date in this date
        table.setReservation(
          this.user?.['person'].pid,
          this.reservationForm?.value.date,
          this.reservationForm?.value.time,
          this.restaurant?.timeSlots!
        );
        // // Old implementation
        // let flag: boolean = table?.dateExists(dateKey)!;
        // if (flag) {
        //   table?.setSlot(
        //     this.user?.['person'].pid,
        //     dateKey,
        //     this.reservationForm?.value.time
        //   );
        // } else {
        //   let slot = [
        //     this.restaurant?.timeSlots,
        //     'null',
        //     'null',
        //     'null',
        //     'null',
        //     'null',
        //   ];
        //   slot[this.reservationForm?.value.time] = this.user?.['person'].pid;
        //   table.pushSlot(dateKey, slot);
        // }

        // creates a reservation object
        let reservationID = Reservation.generateReservationID(
          this.reservationForm?.value.date
        );
        this.restaurant?.addReservation(reservationID);
        let reservation = new Reservation(
          table.tableID,
          table.restaurantID,
          this.user?.['person'].pid,
          this.reservationForm?.value.name,
          this.reservationForm?.value.guests,
          this.reservationForm?.value.date,
          this.restaurantTimeSlots[this.reservationForm?.value.time - 1]
        );

        // modify Database
        this.db
          .addNewRecordWithID(
            reservationID,
            reservation.reservationObject,
            'reservation'
          )
          .then(() => {
            this.db
              .updateRecord(table.tableID!, table.tableObject, 'tables')
              .catch((error) => {
                console.log(error);
              })
              .then(() => {
                this.db
                  .updateRecord(
                    this.restaurant?.restaurantID!,
                    this.restaurant?.restaurantObject,
                    'restaurants'
                  )
                  .catch((error) => {
                    console.log(error);
                  });
              });
          })
          .catch((error) => {
            console.log(error);
          });

        // success message and reset form
        alert('Reserved successfully!');
        this.reset();
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
    // gets restaurant id
    this.restaurant_id = this.route.snapshot.paramMap.get('id')!;

    // gets current user
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });

    // gets restaurant intialized
    this.db
      .getRecord(this.restaurant_id!, 'restaurants')
      .then((data: DocumentSnapshot) => {
        let restaurant = new Restaurant();
        restaurant.constructObject(
          data?.data()?.['vendorID'],
          data?.data()?.['restaurantID'],
          data?.data()?.['restaurantName'],
          data?.data()?.['imgURL'],
          data?.data()?.['category'],
          data?.data()?.['location'],
          data?.data()?.['timeSlots'],
          data?.data()?.['tables'],
          data?.data()?.['description'],
          data?.data()?.['reservations']
        );

        this.restaurant = restaurant;
      });

    // get tables
    // return all snapshots
    collectionSnapshots(this.db.getAll('tables'))
      .pipe(
        map((allDocs) => {
          return allDocs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
        })
      )
      .subscribe((data) => {
        this.tables = data;
      });

    try {
      // reactive form
      this.reservationForm = new FormGroup({
        name: new FormControl(this.user?.['person'].name, [
          Validators.required,
        ]),
        table: new FormControl(null, [Validators.required]),
        date: new FormControl(KlassyService.currentDate, [Validators.required]),
        time: new FormControl(null, [Validators.required]),
        guests: new FormControl(null, [Validators.required]),
      });
    } catch (error) {}
  }
}
