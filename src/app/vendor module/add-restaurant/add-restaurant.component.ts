import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServerService } from './../../services/server.service';
import { AuthService } from './../../services/auth.service';
import { Object } from '../../interface/interface.interface';
import { Component, OnInit } from '@angular/core';
import {
  faTable,
  faLocationArrow,
  faInfo,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import KlassyService from 'src/app/services/klassy.service';
import Restaurant from 'src/app/models/restaurant.model';
import FileService from 'src/app/services/file.service';
import Vendor from 'src/app/models/vendor.model';
import Table from 'src/app/models/table.model';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css'],
})
export class AddRestaurantComponent implements OnInit {
  faInfo = faInfo;
  faTable = faTable;
  faClock = faClock;
  faLocationArrow = faLocationArrow;

  file?: File;
  user?: Object;
  puplished: boolean = false;
  _restaurant?: Restaurant;
  puplishform?: FormGroup;
  file_choosed: boolean = false;
  choosen_file: string = 'No image chosen...';

  constructor(
    private fileSer: FileService,
    private ks: KlassyService,
    public Auth: AuthService,
    private db: ServerService
  ) {}

   inputFile(target: any){
    this.file_choosed = true;
    this.file = target.files[0];
    this.choosen_file = this.file?.name!;
  }

  upload(img_name: string): void {
    this.fileSer.uploadFile(this.file!, img_name);
    // this.setPublishedAtt(true);
  }

  getIMG(img_name: string) {
    try {
      return this.fileSer.getFile(img_name);
    } catch (error) {
      return;
    }
  }

  get timeSlots(): string[][] {
    return this.ks.timeSlots;
  }

  get foodCategories(): string[] {
    return this.ks.foodCategories;
  }

  setPublishedAtt(bool: boolean) {
    this.puplished = bool;
  }

  setTables(table_id: string, restaurant_id: string) {
    let table = new Table(table_id, restaurant_id);
    this.db
      .addNewRecordWithID(table_id, table.tableObject, 'tables')
      .catch((reason) => {
        console.log(reason);
      });
  }

  reset() {
    this.file = undefined;
    this.file_choosed = false;
    this.choosen_file = 'No image chosen...';
    this.puplishform?.reset();
  }

  publish() {
    let vendor_id = this.user?.['person'].pid;

    // set vendor object
    let vendor = new Vendor();
    vendor.constructObject(
      this.user?.['person'].pid,
      this.user?.['person'].name,
      this.user?.['person'].email,
      this.user?.['person'].gender,
      this.user?.['person'].role,
      this.user?.['person'].restaurants
    );

    // add new restaurant object
    let restaurant_id = vendor.addRestaurant();
    let imgurl = restaurant_id + '-' + this.file?.name!;
    let restaurant = new Restaurant(
      vendor_id,
      restaurant_id,
      this.puplishform?.value.name,
      imgurl,
      this.puplishform?.value.category,
      this.puplishform?.value.location,
      this.puplishform?.value.timeslot,
      this.puplishform?.value.tablesCount,
      this.puplishform?.value.description
    );
    this._restaurant = restaurant;

    // update vendor data in firebase
    this.db
      .updateRecord(vendor_id, vendor.personObject, 'users')
      .catch((reason) => {
        console.log(reason);
      });

    // publish restaurant in firebase
    this.db
      .addNewRecordWithID(
        restaurant_id,
        restaurant.restaurantObject,
        'restaurants'
      )
      .then(() => {
        // storing tables
        for (let index = 0; index < restaurant.tables?.length!; index++) {
          this.setTables(restaurant.tables?.[index]!, restaurant_id);
        }

        // uploading image
        this.upload(this._restaurant?.imgURL!);

        // success publish message
        alert('Restaurant published!.');

        // reseting form
        this.reset();
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  ngOnInit(): void {
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });

    this.puplishform = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      timeslot: new FormControl(null, [Validators.required]),
      imgURL: new FormControl(null, [Validators.required]),
      tablesCount: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
  }
}
