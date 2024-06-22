import { Object, ObjectArr } from 'src/app/interface/interface.interface';
export default class Table {
  tableID?: string;
  restaurantID?: string;
  reservations: ObjectArr = {};

  constructor(tableID?: string, restaurantID?: string) {
    this.tableID = tableID;
    this.restaurantID = restaurantID;
  }

  constructObject(
    tableID: string,
    restaurantID: string,
    reservations: ObjectArr
  ): void {
    this.tableID = tableID;
    this.restaurantID = restaurantID;
    this.reservations = reservations;
  }

  get tableObject(): Object {
    let table: Object = {
      tableID: this.tableID,
      restaurantID: this.restaurantID,
      reservations: this.reservations,
    };

    return table;
  }

  getSlotsAvailable(reserve_date: number): number[] {
    let free_slots: number[] = [];
    if (this.dateExists(reserve_date)) {
      this.reservations[reserve_date].forEach((slot, index) => {
        if (slot == 'null' && index > 0) {
          free_slots.push(index - 1);
        }
      });
    } else {
      free_slots = [0, 1, 2, 3, 4];
    }

    return free_slots;
  }

  dateExists(reserve_date: number): boolean {
    return this.reservations[reserve_date] != undefined;
  }

  setSlot(person_id: string, index: number, slot: number): void {
    this.reservations[index][slot] = person_id;
  }

  pushSlot(key: number, value: any[]): void {
    this.reservations[key] = value;
  }

  getReserveKey(reservation_date: any): number {
    return +reservation_date.replaceAll('-', '');
  }

  setReservation(
    person_id: string,
    dateKey: any,
    slot: number,
    timeslotindex: string
  ) : void {
    dateKey = this.getReserveKey(dateKey);
    if (this.dateExists(dateKey)) {
      this.setSlot(person_id, dateKey, slot);
    } else {
      let slot_array = [timeslotindex, 'null', 'null', 'null', 'null', 'null'];
      slot_array[slot] = person_id;
      this.pushSlot(dateKey, slot_array);
    }
  }

  static generateTableID(): string {
    return 'table-' + Math.floor(Math.random() * 1_000_000_000_000 + 1);
  }
}
