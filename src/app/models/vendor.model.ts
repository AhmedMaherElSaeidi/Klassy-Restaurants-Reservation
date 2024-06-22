import { Object } from 'src/app/interface/interface.interface';
import Person from './person.model';
import Restaurant from './restaurant.model';

export default class Vendor extends Person {
  restaurants: string[] = [];

  constructor(
    pid?: string,
    name?: string,
    email?: string,
    gender?: string,
    role?: string,
    NumberOfRestaurants?: number
  ) {
    super(pid, name, email, gender, role);
    for (let index = 0; index < NumberOfRestaurants! || 0; index++) {
      this.restaurants.push(Restaurant.generateRestaurantID());
    }
  }

  constructObject(
    pid: string,
    name: string,
    email: string,
    gender: string,
    role: string,
    restaurants: string[]
  ): void {
    this.pid = pid;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.role = role;
    this.restaurants = restaurants;
  }

  override get personObject(): Object {
    let person: Object = {
      pid: this.pid,
      name: this.name,
      email: this.email,
      gender: this.gender,
      role: this.role,
      restaurants: this.restaurants,
    };

    return person;
  }

  addRestaurant(): string {
    let restaurant_ID = Restaurant.generateRestaurantID();
    this.restaurants.push(restaurant_ID);
    return restaurant_ID;
  }

  removeRestaurant(restaurant_id: string): boolean {
    const indexOfObject = this.restaurants.findIndex((str_id) => {
      return str_id === restaurant_id;
    });

    if (indexOfObject !== -1) {
      this.restaurants.splice(indexOfObject, 1);
      return true;
    }

    return false;
  }
}
