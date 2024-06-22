import { Router } from '@angular/router';
import { ServerService } from './../../services/server.service';
import { collectionSnapshots } from '@angular/fire/firestore';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Object } from '../../interface/interface.interface';
import { AuthService } from './../../services/auth.service';
import KlassyService from 'src/app/services/klassy.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
})
export class RestaurantsComponent implements OnInit {
  category: string = 'All categories';
  restaurants: any[] = [];
  user?: Object;

  faSearch = faSearch;

  constructor(
    private ks: KlassyService,
    public Auth: AuthService,
    private router: Router,
    private db: ServerService,
  ) {}

  getFoodCategories(): string[] {
    return this.ks.foodCategories;
  }

  getRestaurants(category: string) {
    if (category === 'All categories') {
      return this.restaurants;
    } else {
      return this.restaurants.filter(
        (restaurant) => restaurant.category === category
      );
    }
  }

  setCategory(categ: any) {
    this.category = categ.value;
    if (categ.value == '*') {
      this.category = 'All categories';
    }
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
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });

    // return all snapshots
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
