export default class KlassyService {

  foodCategories: string[] = [
    'Fruit and vegetables',
    'Starchy food',
    'Dairy',
    'Protein',
    'Sea food',
    'Beverages',
    'Added Sugars'
  ];

  timeSlots: string[][] = [
    ["8:00", "10:00", "12:00", "14:00", "16:00"],
    ["10:00", "12:00", "14:00", "16:00", "18:00"],
    ["12:00", "14:00", "16:00", "18:00", "20:00"],
    ["8:00", "10:00", "14:00", "18:00", "22:00"],
    ["9:00", "12:00", "16:00", "17:00", "20:00"]
  ]

  constructor() {}

  static get currentDate(): string {
    let date_string = '';
    let date = new Date();

    let curr_date = date.toLocaleDateString();
    date_string +=
      curr_date.substring(6) +
      '-' +
      curr_date.substring(0, 2) +
      '-' +
      curr_date.substring(3, 5);

    return date_string;
  }
}