import { Object } from '../interface/interface.interface';
import Table from './table.model';

export default class Restaurant {
  VendorID?: string;
  restaurantID?: string;
  restaurantName?: string;
  imgURL?: string;
  category?: string;
  location?: string;
  timeSlots?: string;
  tables?: string[] = [];
  description?:string;
  reservations:string[] = [];

  constructor(
    VendorID?: string,
    restaurantID?: string,
    restaurantName?: string,
    imgURL?: string,
    category?: string,
    location?: string,
    timeslots?: string,
    tables_number?: number,
    description?: string,
  ) {
    this.VendorID = VendorID;
    this.restaurantID = restaurantID;
    this.restaurantName = restaurantName;
    this.imgURL = imgURL;
    this.category = category;
    this.location = location;
    this.timeSlots = timeslots;
    this.description = description;

    for (let index = 0; index < tables_number!; index++)
      this.tables?.push(Table.generateTableID());
  }

  constructObject(
    VendorID: string,
    restaurantID: string,
    restaurantName: string,
    imgURL: string,
    category: string,
    location: string,
    timeSlots: string,
    tables: string[],
    description:string,
    reservations:string[]
  ): void {
    this.VendorID = VendorID;
    this.restaurantID = restaurantID;
    this.restaurantName = restaurantName;
    this.imgURL = imgURL;
    this.category = category;
    this.location = location;
    this.timeSlots = timeSlots;
    this.tables = tables;
    this.description = description;
    this.reservations = reservations;
  }

  get restaurantObject() : Object{
    let restaurant: Object = {
      vendorID: this.VendorID,
      restaurantID: this.restaurantID,
      restaurantName: this.restaurantName,
      imgURL: this.imgURL,
      category: this.category,
      location: this.location,
      timeSlots: this.timeSlots,
      tables: this.tables,
      description : this.description,
      reservations : this.reservations
    };

    return restaurant;
  }

  addReservation(reservation_id:string) : void{
    this.reservations.push(reservation_id);
  }

  removeReservation(reservation_id:string) : void{
    let index = this.reservations.indexOf(reservation_id);
    if(index !== -1)
      this.reservations.splice(index,1);
  }

  static generateRestaurantID() : string {
    return 'restaurant-' + Math.floor(Math.random() * 1_000_000_000_000 + 1);
  }
}
