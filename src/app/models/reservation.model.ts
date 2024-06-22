import { Object } from './../interface/interface.interface';

export default class Reservation {
  tableID?: string;
  restaurantID?: string;
  customerID?: string;
  guestName?: string;
  numberOfSeats?: number;
  ReservationDate?: string;
  timeslot?: string;

  constructor(
    tableID?: string,
    restaurantID?: string,
    customerID?: string,
    guestName?: string,
    numberOfSeats?: number,
    ReservationDate?: string,
    timeslot?: string
  ) {
    this.tableID = tableID;
    this.restaurantID = restaurantID;
    this.customerID = customerID;
    this.guestName = guestName;
    this.numberOfSeats = numberOfSeats;
    this.ReservationDate = ReservationDate;
    this.timeslot = timeslot;
  }

  constructObject(
    tableID: string,
    restaurantID: string,
    customerID: string,
    guestName: string,
    numberOfSeats: number,
    ReservationDate: string,
    timeslot: string
  ): void {
    this.tableID = tableID;
    this.restaurantID = restaurantID;
    this.customerID = customerID;
    this.guestName = guestName;
    this.numberOfSeats = numberOfSeats;
    this.ReservationDate = ReservationDate;
    this.timeslot = timeslot;
  }

  get reservationObject() : Object{
    let reservation: Object = {
      tableID: this.tableID,
      restaurantID: this.restaurantID,
      customerID: this.customerID,
      guestName:this.guestName,
      numberOfSeats: this.numberOfSeats,
      ReservationDate: this.ReservationDate,
      timeslot: this.timeslot,
    };

    return reservation;
  }

  static generateReservationID(reserve_date: string) : string {
    return (
      'reserve-' + reserve_date + '-' + Math.floor(Math.random() * 1_000 + 1)
    );
  }
}
